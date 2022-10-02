import { clone, redis } from "../../deps.ts";
import * as k from "./data-keys.ts";

export class RedisDataClient {
  // deno-lint-ignore no-explicit-any
  #redisConfig: any;
  #redis?: redis.Redis;

  constructor(redisHosts: string) {
    // TODO: advanced parser to match redis-commander multiple-hosts config
    const [_label, hostname, port] = redisHosts.split(":");
    this.#redisConfig = { hostname, port };
  }

  async #client() {
    if (this.#redis) return this.#redis;
    return this.#redis = await redis.connect(this.#redisConfig);
  }

  #close() {
    const client = this.#redis;
    this.#redis = undefined;
    try {
      client!.close();
    } catch (_error) {
      // swallow error
    }
  }

  async #getHourStats(hour: number) {
    const client = await this.#client();
    const p = client.pipeline();
    const prev = k.prev(hour);
    p.get(k.countRollup(prev, 24));
    p.get(k.countRollup(prev, 48));
    p.get(k.tagRollup(prev, 24));
    p.get(k.tagRollup(prev, 48));
    p.get(k.count(hour));
    p.zrange(k.tag(hour), -10, -1);
    let [count24, count48, hashtag24, hashtag48, countCurrent, hashtagCurrent] =
      await p.flush();

    if (!count24) {
      count24 = await this.#rollupCount(prev, 24);
    }
    if (!count48) {
      count48 = await this.#rollupCount(prev, 48);
    }
    if (!hashtag24) {
      hashtag24 = await this.#rollupTags(prev, 48);
    }
    if (!hashtag48) {
      hashtag48 = await this.#rollupTags(prev, 48);
    }

    return {
      count24,
      hashtag24,
      count48,
      hashtag48,
      countCurrent,
      hashtagCurrent,
    };
  }

  async #rollupCount(hour: number, hours: number) {
    const client = await this.#client();
    const counts = await client.mget(
      ...k.hoursList(hour, hours).map((h) => `count:${h}`),
    );
    console.log({ counts });

    // deno-lint-ignore no-explicit-any
    const total = counts.map((n) => parseInt(n as any) || 0).reduce((a, b) =>
      a + b
    );

    // persist hour rollup
    await client.mset(k.countRollup(hour, hours), total);

    return total;
  }

  // deno-lint-ignore require-await no-unused-vars
  async #rollupTags(hour: number, hours: number) {
    return null;
  }

  // deno-lint-ignore no-explicit-any
  async getStats(): Promise<any> {
    try {
      // get status for previous hour
      const stats = await this.#getHourStats(k.prev(k.hour()));

      // TODO: if stats for prior hour aren't present, generate them

      // return stats for prior hour
      return stats;
    } catch (error) {
      console.log(
        JSON.stringify({ on: new Date(), level: "ERROR", error: clone(error) }),
      );
      this.#close();
    }
  }
}
