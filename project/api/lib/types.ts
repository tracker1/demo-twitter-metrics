import { oak } from "../deps.ts";
import { RedisDataClient } from "./redis/data-client.ts";

/*
{
  type Context,
  type RouteParams,
  Router,
  type RouterContext,
  type State as AnyOakState,
}
*/

export interface AppState {
  appName: string;
  redis: RedisDataClient;
}

export interface ContextState extends AppState {
  requestId: string;
  started: Date;
}

export type Application = oak.Application<AppState>;
export type Context = oak.Context<ContextState, AppState>;
