# demo-twitter-metrics

Simple demo application gathering and displaying some metrics from twitter api.

Using Deno, mostly because it's a simpler approach to being able to create
something like this quickly.

## Dependencies

- **Docker** - either docker desktop or community to run the compose file
  declarations.
- **Deno** - JavaScript/TypeScript runtime for the backend api and metrics
  applications.
- **Node** - JavaScript runtime and build tools for the frontend ui application.

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

See `README.md` in each project directory.

- [**redis**](http://localhost:8005) - Backend data store.
- [**api**](http://localhost:8002) - Backend API to retrieve rollup counts.
- **twitter-metrics** - Backend metrics gathering from twitter through api.
- [**ui**](http://localhost:8000) - React/TypeScript UI with Vite.js

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
