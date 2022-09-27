#!/usr/bin/env -S deno run --allow-read --allow-env

import { dotenvConfig, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));

function hasFileSync(filePath: string) {
  try {
    const f = Deno.statSync(filePath);
    return !!f;
  } catch (_) {
    return false;
  }
}

export function find() {
  let current = __dirname;
  let last = "";
  while (current !== last) {
    const envFile = `${current}/.env`;
    if (hasFileSync(envFile)) {
      return envFile;
    }

    last = current;
    current = path.dirname(current);
  }
  return "";
}

export function load() {
  const envFilePath = find();
  dotenvConfig({
    path: envFilePath,
    export: true,
    safe: true,
  });
}
