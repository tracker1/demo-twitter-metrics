# Build Node Project
FROM node:18.10.0 as Build

RUN apt-get update \
  && apt-get install -yqq zstd brotli gzip \
  && apt-get clean autoclean \
  && apt-get autoremove --yes \
  && rm -rf /var/lib/{apt,dpkg,cache,log}/

WORKDIR /app

COPY ./package*.* ./
RUN npm ci

COPY . .
RUN npm run build \
  && chmod +x _scripts/* \
  && _scripts/postbuild.sh

# Setup Caddy Server
FROM caddy:2.6.1-alpine

COPY --from=Build /app/dist /app
COPY _server/Caddyfile /etc/caddy/Caddyfile
