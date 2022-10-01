import { qs } from "../../deps.ts";

/**
 * base url for Twitter's sample stream
 */
export const twitterSampleStreamBaseUrl =
  "https://api.twitter.com/2/tweets/sample/stream";

/**
 * Additional options for Twitter's sample stream results.
 * Will include the author's id, created at, and entities (for parsed hashtags)
 *
 * https://developer.twitter.com/en/docs/twitter-api/tweets/volume-streams/api-reference/get-tweets-sample-stream#tab1
 */
export const streamOptions = {
  "tweet.fields": ["created_at", "entities"].join(","),
  "expansions": ["author_id"].join(","),
};

export const sampleStreamUrl = `${twitterSampleStreamBaseUrl}?${
  qs.stringify(streamOptions)
}`;
// console.log("sampleStreamUrl", sampleStreamUrl);
