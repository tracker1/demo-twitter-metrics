#!/usr/bin/env -S deno run --watch --allow-read --allow-env --allow-net --unstable

import { load as loadEnv } from "./lib/dotenv.ts";
import { getSampleTweetStream } from "./lib/twitter/get-sample-tweet-stream.ts";
import { RedisDataClient } from "./lib/redis/data-client.ts";

loadEnv();

const TWITTER_BEARER_TOKEN = Deno.env.get("TWITTER_BEARER_TOKEN") || "";
const REDIS_HOSTS = Deno.env.get("REDIS_HOSTS") || "";

if (!(TWITTER_BEARER_TOKEN && REDIS_HOSTS)) {
  console.log(JSON.stringify({
    on: new Date(),
    level: "FATAL",
    message: `Missing required environment variable.`,
    TWITTER_BEARER_TOKEN: TWITTER_BEARER_TOKEN ? "present" : "missing",
    REDIS_HOSTS: REDIS_HOSTS ? "present" : "missing",
  }));
  Deno.exit(1);
}

const getNext = () => new Date().valueOf() + 10000; // 10 seconds in the future

let count = 0;
let logAt = getNext();
const dataClient = new RedisDataClient(REDIS_HOSTS);

console.log(JSON.stringify({
  on: new Date(),
  level: "START",
  message: "Starging metrics gathering",
}));
for await (const tweet of getSampleTweetStream(TWITTER_BEARER_TOKEN)) {
  await dataClient.saveTweet(tweet);

  count++;
  const now = new Date();
  if (logAt < now.valueOf()) {
    console.log(JSON.stringify({
      on: now,
      level: "INFO",
      message: "Updated Count",
      count,
    }));
    logAt = getNext();
  }
}
