import { clone, redis } from "../../deps.ts";
import * as k from "./data-keys.ts";

const ROLLUP_EXPIRE = 60 * 60 * 24 * 14; // 2 weeks
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
    const count24 = await this.#rollupCount(hour, 24);
    const count48 = await this.#rollupCount(hour, 48);
    const hashtag24 = await this.#rollupTags(hour, 48);
    const hashtag48 = await this.#rollupTags(hour, 48);

    return {
      count24,
      hashtag24,
      count48,
      hashtag48,
    };
  }

  async #rollupCount(hour: number, hours: number) {
    const client = await this.#client();

    // check for existing total - if it exists, use it
    let total = +(await client.get(k.countRollup(hour, hours)) || 0);
    if (total) {
      return total;
    }

    // rollup counts and persist
    const counts = await client.mget(
      ...k.hoursList(hour, hours).map((h) => `count:${h}`),
    );
    console.log({ counts });

    // deno-lint-ignore no-explicit-any
    total = counts.map((n) => +(n as any) || 0).reduce((a, b) => a + b);

    // persist hour rollup
    await client.mset(k.countRollup(hour, hours), total);
    await client.expire(k.countRollup(hour, hours), ROLLUP_EXPIRE); // expire in 14 days

    return total;
  }

  async #rollupTags(hour: number, hours: number) {
    const client = await this.#client();

    // check for existing rollup, use it if it's there
    const hashtags = await client.zrange(k.tagRollup(hour, hours), -10, -1);
    if (hashtags?.length) {
      return hashtags;
    }

    // limit top N for any given hour to 1000 tags, more isn't needed here
    const card = await client.zcard(k.tag(hour));
    if (card > 1000) {
      await client.zremrangebyrank(k.tag(hour), 0, -1001);
    }

    // create union record for last N hours
    await client.zunionstore(
      k.tagRollup(hour, hours),
      k.hoursList(hour, hours).map((h) => k.tag(h)),
    );
    await client.expire(k.tagRollup(hour, hours), ROLLUP_EXPIRE);

    return await client.zrange(k.tagRollup(hour, hours), -10, -1);
  }

  // deno-lint-ignore no-explicit-any
  async getStats(): Promise<any> {
    try {
      const hour = k.hour();
      const stats = await this.#getHourStats(k.prev(hour));

      const client = await this.#client();
      const countCurrent = await client.get(k.count(hour));
      const hashtagCurrent = await client.zrange(k.tag(hour), -10, -1);

      return {
        countCurrent: +(countCurrent || 0),
        hashtagCurrent,
        ...stats,
      };
    } catch (error) {
      console.log(
        JSON.stringify({ on: new Date(), level: "ERROR", error: clone(error) }),
      );
      this.#close();
    }
  }
}
