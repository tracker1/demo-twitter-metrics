#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net --unstable

import { load as loadEnv } from "./lib/dotenv.ts";
import { getSampleTweets } from "./lib/get-sample-tweets.ts";

loadEnv();

const BEARER_TOKEN = Deno.env.get("BEARER_TOKEN") || "";

let count = 0;
for await (const tweet of getSampleTweets(BEARER_TOKEN)) {
  console.log(tweet);
  if (++count > 10) break;
}
