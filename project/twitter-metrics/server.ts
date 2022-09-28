#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net

import { load as loadEnv } from "./lib/dotenv.ts";
import {
  connectStream as connectTwitterStream,
  StreamTweet,
} from "https://deno.land/x/twitter_api_client@v0.2.2/api_v2/tweets/filtered_stream.ts";

loadEnv();

const BEARER_TOKEN = Deno.env.get("BEARER_TOKEN") || "";

// deno-lint-ignore require-await
async function handleTweet(tweet: StreamTweet) {
  console.log({ tweet });
}

// none option
const disconnect = connectTwitterStream(BEARER_TOKEN, handleTweet);

// Disconnect Stream after 10sec.
setTimeout(() => disconnect(), 10 * 1000);
