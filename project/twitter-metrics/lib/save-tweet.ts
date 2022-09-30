import { Tweet } from "./types.ts";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function saveTweet(tweet: Tweet) {
  await delay(10);
  console.log("tweet", tweet);
}
