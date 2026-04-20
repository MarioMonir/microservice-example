# syntax=docker/dockerfile:1.7

# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Enable pnpm via corepack (ships with Node 20, no global install needed)
RUN corepack enable

# Copy only manifests first for better layer caching
COPY package.json pnpm-lock.yaml .npmrc* ./

# Use BuildKit cache mount for pnpm's store — massive speedup on rebuilds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

# ---------- Stage: dev (Vite dev server) ----------
FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable

ENV NODE_ENV=development
# Polling is needed on macOS/Windows bind mounts — file events don't propagate
# from the host into the container, so chokidar must poll.
ENV CHOKIDAR_USEPOLLING=true

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5179

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# ---------- Stage 2: build ----------
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars for Vite (must be prefixed VITE_)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Stage 3: runtime (nginx) ----------
FROM nginx:1.27-alpine AS runtime

# Remove default config, add our SPA-aware one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets
COPY --from=build /app/dist /usr/share/nginx/html

# Run as non-root (nginx image already ships an `nginx` user)
# Fix permissions for the non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]