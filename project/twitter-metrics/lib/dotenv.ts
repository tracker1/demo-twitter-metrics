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
  if (!envFilePath) return;
  // console.log(`Loading ${envFilePath}`);
  dotenvConfig({
    path: envFilePath,
    export: true,
  });
}
