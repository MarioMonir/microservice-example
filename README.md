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
