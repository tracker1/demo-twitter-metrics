import { JsonParseStream, TextLineStream } from "../../deps.ts";
import { Tweet } from "../types.ts";
import { sampleStreamUrl } from "./config.ts";
import { resultToTweet } from "./result-to-tweet.ts";

/**
 * Get the fetch request options for the bearerToken
 *
 * @param bearerToken Authorization token to use
 * @returns fetch request options for authorization
 */
export const getFetchOptions = (bearerToken: string) => ({
  headers: {
    "Authorization": `Bearer ${bearerToken}`,
  },
});

/**
 * Retrieve an async stream of Tweet results.
 *
 * @param bearerToken access token for the twitter API.
 * @returns an async generator for each Tweet
 */
export async function* getSampleTweetStream(
  bearerToken: string,
): AsyncGenerator<Tweet, void, unknown> {
  // make initial request to twitter api
  const { body } = await fetch(
    sampleStreamUrl,
    getFetchOptions(bearerToken),
  );

  // handle the result stream - generator for each line separated json result
  const stream = body! // non-null asertion operator - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
    .pipeThrough(new TextDecoderStream()) // convert Uint8Array to string (built-in)
    .pipeThrough(new TextLineStream()) // transform into a stream where each chunk is divided by a newline
    .pipeThrough(new JsonParseStream()); // parse each chunk as JSON

  // async iteration
  for await (const result of stream) {
    // parse each result
    const tweet = resultToTweet(result);

    // if it's a tweet - yield it to listening stream
    if (tweet) yield tweet;
  }
}
