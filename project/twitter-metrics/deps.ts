import * as path from "https://deno.land/std@0.157.0/path/mod.ts";
import { configSync as dotenvConfig } from "https://deno.land/std@0.157.0/dotenv/mod.ts";

import { clone } from "https://raw.githubusercontent.com/tracker1/deno-lib/main/utils/clone.ts";

export { clone, dotenvConfig, path };
