// deno-lint-ignore-file no-explicit-any

import { JsonParseStream, qs, TextLineStream } from "../deps.ts";
import { Tweet } from "./types.ts";

const twitterUrl = "https://api.twitter.com/2/tweets/sample/stream";

// https://developer.twitter.com/en/docs/twitter-api/tweets/volume-streams/api-reference/get-tweets-sample-stream#tab1
const streamOptions = {
  "tweet.fields": [
    "created_at",
    "entities",
  ].join(","),
  "expansions": ["author_id"]
    .join(","),
};

export function recordToTweet(record: any): Tweet | null {
  if (!record?.data) {
    return null;
  }
  // console.log("data", record?.data);

  const {
    id,
    created_at,
    author_id,
    text,
    entities,
  } = record.data;

  const hashtags: string[] = entities?.hashtags?.map((r: any) => r.tag) || [];

  const ret = {
    id,
    created: new Date(created_at),
    author: author_id,
    text,
    hashtags,
  };
  return ret;
}

export async function* getSampleTweets(bearerToken: string) {
  const twitterOptions = {
    headers: {
      "Authorization": `Bearer ${bearerToken}`,
    },
  };

  const url = `${twitterUrl}?${qs.stringify(streamOptions)}`;
  // console.log("url", url);
  // return;
  const { body } = await fetch(
    url,
    twitterOptions,
  );
  const stream = body!
    .pipeThrough(new TextDecoderStream()) // convert Uint8Array to string
    .pipeThrough(new TextLineStream()) // transform into a stream where each chunk is divided by a newline
    .pipeThrough(new JsonParseStream()); // parse each chunk as JSON

  for await (const entry of stream) {
    const tweet = recordToTweet(entry);
    if (tweet) yield tweet;
  }
}
