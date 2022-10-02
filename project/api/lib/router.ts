import { oak } from "../deps.ts";
import { Application, ContextState } from "./types.ts";

const getHomeBody = (appName: string) =>
  `<!DOCTYPE html>
    <html>
      <head><title>${appName}</title><head>
      <body>
        <h1>Welcome</h1>
        <p>
          To get the current stats, get /api/current
        </p>
      </body>
    </html>
  `;

export function addRoutes(app: Application) {
  const router = new oak.Router<ContextState>();

  router.get("/", (ctx) => {
    ctx.response.body = getHomeBody(ctx.state.appName);
  });

  router.get("/api/current", async (ctx) => {
    ctx.response.body = await ctx.app.state.redis.getStats();
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
