FROM denoland/deno:1.26.0

USER deno

WORKDIR /app

# cache dependencies
COPY deps.ts .
RUN deno cache deps.ts

COPY . .
RUN deno cache main.ts
RUN mkdir -p /var/tmp/log

CMD ["run", "--allow-read", "--allow-env", "--allow-net", "--unstable", "main.ts"]
