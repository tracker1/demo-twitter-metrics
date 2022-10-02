import { clone } from "../../deps.ts";
import { Context } from "../types.ts";

/**
 * Adds contextual values, context, logging and error handling
 */
export const handleRequestContext = () =>
async (
  ctx: Context,
  next: () => Promise<unknown>,
): Promise<void> => {
  // mark the start of the request
  const start = performance.now();
  const started = ctx.state.started = new Date();

  // assign/use a request id
  const id = ctx.state.requestId = ctx.request.headers.get("X-Request-Id") ||
    crypto.randomUUID();

  // get the ip and the url parameters
  const { method, url, ip } = ctx.request;
  const request = { id, started, method, path: url.pathname, ip };

  console.log(JSON.stringify({
    on: new Date(),
    level: "REQUEST",
    message: "Request Started",
    request,
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
      request,
      error,
    }));

    ctx.response.body = ctx.response.body || {
      status,
      error: Object.assign(error, { stack: undefined }),
    };
  }

  const { status } = ctx.response;
  const ms = performance.now() - start;

  console.log(JSON.stringify({
    on: new Date(),
    level: "RESPONSE",
    message: "Request Complete",
    request,
    response: { status, ms },
  }));
};
