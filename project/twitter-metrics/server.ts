#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net

import { load as loadEnv } from "./lib/dotenv.ts";
import { clone, TwitterClient } from "./deps.ts";

loadEnv();

const twitterConfig = {
  consumer_key: Deno.env.get("CONSUMER_KEY"),
  consumer_secret: Deno.env.get("CONSUMER_SECRET"),
  access_token: Deno.env.get("ACCESS_TOKEN"),
  access_token_secret: Deno.env.get("ACCESS_TOKEN_SECRET"),
  bearer_token: Deno.env.get("BEARER_TOKEN"),
};

const twitter = new TwitterClient(twitterConfig);

try {
  const stream = twitter.stream("statuses/sample", undefined);
} catch (err) {
  console.log(clone(err));
}

// stream?.on("tweet", function (tweet) {
//   console.log(tweet);
// });
