#!/usr/bin/env -S deno run --allow-read --allow-env --allow-net --unstable

import { load as loadEnv } from "./lib/dotenv.ts";
import { oak } from "./deps.ts";
import { Application } from "./lib/types.ts";
import { addRoutes } from "./lib/router.ts";
import { RedisDataClient } from "./lib/redis/data-client.ts";
import { handleRequestContext } from "./lib/middleware/context.ts";

loadEnv();

const REDIS_HOSTS = Deno.env.get("REDIS_HOSTS") || "";

if (!(REDIS_HOSTS)) {
  console.log(JSON.stringify({
    on: new Date(),
    message: `Missing required environment variable.`,
    REDIS_HOSTS: REDIS_HOSTS ? "present" : "missing",
  }));
  Deno.exit(1);
}

const app: Application = new oak.Application();
app.state.appName = "Twitter Demo Stats";
app.state.redis = new RedisDataClient(REDIS_HOSTS);
app.use(handleRequestContext());
addRoutes(app);

app.listen({ port: 8002 });
console.log(JSON.stringify({
  on: new Date(),
  level: "START",
  message: "Started http://localhost:8002/",
}));
