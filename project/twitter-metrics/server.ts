#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net --unstable

import { load as loadEnv } from "./lib/dotenv.ts";
import { getSampleTweets } from "./lib/get-sample-tweets.ts";
import { saveTweet } from "./lib/save-tweet.ts";

loadEnv();

const TWITTER_BEARER_TOKEN = Deno.env.get("TWITTER_BEARER_TOKEN") || "";

let count = 0;
for await (const tweet of getSampleTweets(TWITTER_BEARER_TOKEN)) {
  saveTweet(tweet);
  if (++count > 10) break;
}
