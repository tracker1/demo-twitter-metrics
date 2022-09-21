# demo-twitter-metrics

Simple demo application gathering and displaying some metrics from twitter api.

Using Deno, mostly because it's a simpler approach to being able to create
something like this quickly.

## Running

- Copy `.env.sample` to `.env`.
  - Edit the file to include relevant keys for use with Twitter's API
- `docker compose up -d`

You can start the redis instance specifically with `docker compose up -d redis`
and the separate applications can each be started similarly, or developed
directly, as they will each search for their given `.env` file upward.

The `project/ui` will run with `npm start` and reverse-proxy to the API on the
default backend port.

## Projects

Each application will be under `project/*` as self-contained.

### Redis

Backend appliation data store. See `project/redis/README.md`.

### Twitter Metrics

Gather metrics from twitter streams into redis via api.

- redis - https://deno.land/x/redis@v0.27.0
- twitter - https://github.com/MateoCerquetella/twit-deno

### API

Api to receive metrics and retrieve current counts, etc.

### UI

Simple react ui to show active counts (current hour), last 24 and 48.

## Other considerations

I feel the first versions of most things should be done in a scripted
language/environment and with containerization and APIs it's easy enough to swap
out such services as necessary if per-instance performance needs to be optimized
for a given area.

- node - similar approach to deno, slightly more complex app management
- rust - likely optimal in terms of absolute throughput with minimal overhead
- golang - maximum portability, single executable, slightly slower than rust
- C# (.Net) - fair portability, similar performance to golang

# License

MIT License
