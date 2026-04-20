# syntax=docker/dockerfile:1.7

# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml .npmrc* ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

# ---------- Stage: dev (watch mode) ----------
FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable

ENV NODE_ENV=development
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client against the committed schema.
RUN pnpm exec prisma generate

EXPOSE 3000

# Apply migrations before starting the watcher so the DB matches the schema.
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm start:dev"]

# ---------- Stage 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm exec prisma generate
RUN pnpm run build

# Prune dev dependencies for a lean runtime image.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm prune --prod

# ---------- Stage 3: runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Writable data directory for the SQLite DB.
# Owned by the `node` user so it works both with and without a mounted volume.
RUN mkdir -p /data && chown -R node:node /data

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/api/v1/health/live || exit 1

CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node dist/main.js"]
