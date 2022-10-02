// ctx: oak.Context<Record<string, any>, Record<string, any>>
// next: Promise<unknown>

import { clone } from "../../../twitter-metrics/deps.ts";
import { Context } from "../types.ts";

export const handleRequestContext = () =>
async (
  ctx: Context,
  next: () => Promise<unknown>,
): Promise<void> => {
  // mark the start of the request
  const started = ctx.state.started = new Date();

  // assign/use a request id
  const id = ctx.state.requestId = ctx.request.headers.get("X-Request-Id") ||
    crypto.randomUUID();

  // get the ip and the url parameters
  const { url, ip } = ctx.request;

  console.log(JSON.stringify({
    on: new Date(),
    level: "INFO",
    message: "Request Started",
    request: { id, started, url, ip },
  }));

  try {
    await next();
  } catch (err) {
    const status = ctx.response.status = err?.status || 500;
    const error = clone(err);

    console.log(JSON.stringify({
      on: new Date(),
      level: "ERROR",
      message: "Error Result",
      error,
    }));

    ctx.response.body = ctx.response.body || {
      status,
      error: Object.assign(error, { stack: undefined }),
    };
  }

  const { status } = ctx.response;
  const ms = new Date().valueOf() - started.valueOf();

  console.log(JSON.stringify({
    on: new Date(),
    level: "INFO",
    message: "Request Complete",
    request: { id, started, url, ip },
    response: { status, ms },
  }));
};
