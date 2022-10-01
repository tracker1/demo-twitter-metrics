import { clone, redis } from "../../deps.ts";
import { Tweet } from "../types.ts";

export class RedisDataClient {
  #redis?: redis.Redis;

  constructor(private redisHosts: string) {}

  async #connect() {
    if (this.#redis) return;

    // TODO: advanced parser to match redis-commander multiple-hosts config
    const [_label, hostname, port] = this.redisHosts.split(":");
    this.#redis = await redis.connect({ hostname, port });
  }

  async saveTweet(tweet: Tweet) {
    try {
      await this.#connect();

      // TODO: consider using timestamp from tweet instead
      const hour = new Date().toISOString().replace(/\D/g, "").substring(0, 10);
      const p = this.#redis!.pipeline();

      const count = `count:${hour}`;
      const tags = `hashtag:${hour}`;
      const expireIn = 60 * 60 * 50; // 50 hours in seconds

      // increment count for hour
      p.setnx(count, 0);
      p.incr(count);
      p.expire(count, expireIn);

      // increment each hashtag
      for (const tag of tweet.hashtags) {
        p.zadd(tags, 1, tag);
      }
      p.expire(tags, expireIn);

      // send commands to redis
      await p.flush();
    } catch (error) {
      if (error.name === "ConnectionRefused") {
        this.#redis = undefined;
        throw error; // connection failed
      }
      console.log(new Date(), { error: clone(error) });
    }
  }
}
