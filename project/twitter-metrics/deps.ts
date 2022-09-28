import * as path from "https://deno.land/std@0.157.0/path/mod.ts";
import { configSync as dotenvConfig } from "https://deno.land/std@0.157.0/dotenv/mod.ts";
// import TwitterClient from "https://deno.land/x/simple_twitter_deno@0.02/simple_twitter_deno.ts";
import * as TwitterClient from "https://deno.land/x/twitter_api_client@v0.2.2/mod.ts";

import { clone } from "https://raw.githubusercontent.com/tracker1/deno-lib/main/utils/clone.ts";

export { clone, dotenvConfig, path, TwitterClient };
