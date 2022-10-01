// deno-lint-ignore-file no-explicit-any

import { Tweet } from "../types.ts";

/**
 * Converts a result line from a stream to a Tweet instance.
 *
 * @param record parsed json line from a twitter result stream
 * @returns Tweet instance or null
 */
export function resultToTweet(record: any): Tweet | null {
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
