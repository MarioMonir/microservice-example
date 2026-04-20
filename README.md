# microservice-example

Two services orchestrated with Docker Compose:

- **api-gateway** — NestJS (port `3000`)
- **client** — React + Vite, served by nginx in prod (port `8080`) or Vite dev server (port `5179`)

## Prerequisites

- Docker Desktop (with Compose v2)

## Production

Builds optimized images (multistage: pnpm install → build → prune → minimal runtime).

```bash
docker compose up --build -d
```

- Client → http://localhost:8080
- API gateway → http://localhost:3000

Stop:

```bash
docker compose down
```

## Development (hot reload)

Bind-mounts source from host into the containers; uses anonymous volumes for `node_modules` so the container's installed deps aren't shadowed.

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

- Client → http://localhost:5179 (Vite HMR)
- API gateway → http://localhost:3000 (Nest `start:dev` watch)

Edit any file in `api-gateway/src/` or `client/src/` on the host — changes are picked up automatically.

Tail logs:

```bash
docker compose -f docker-compose.dev.yml logs -f
```

Stop:

```bash
docker compose -f docker-compose.dev.yml down
```

### Rebuild from scratch (fresh `node_modules`)

The dev compose keeps `node_modules` in an anonymous volume so the host's copy doesn't shadow the image's. That volume is **not** recreated on a normal `up --build`, so if you bump deps (e.g. Prisma major), the container keeps using the stale copy. Use this when deps change or you hit weird version mismatches:

```bash
docker compose -f docker-compose.dev.yml build --no-cache && \
docker compose -f docker-compose.dev.yml up -d --force-recreate --renew-anon-volumes
```

`--renew-anon-volumes` wipes only the anonymous `node_modules` volumes — the named `api-gateway-data` volume (SQLite DB) is preserved.

## Layout

```
.
├── docker-compose.yml          # production
├── docker-compose.dev.yml      # development (hot reload)
├── api-gateway/                # NestJS service
│   └── Dockerfile              # stages: deps → dev → build → runtime
└── client/                     # React + Vite
    └── Dockerfile              # stages: deps → dev → build → runtime (nginx)
```
