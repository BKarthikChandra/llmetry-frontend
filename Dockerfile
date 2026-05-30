# Stage 1: Install dependencies
# Isolated so Docker cache busts only when package files change, not source files.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the Vite app
# VITE_* vars are baked into the static bundle at build time by the Vite compiler,
# so they must be available here as ENV (not just ARG) during `npm run build`.
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 3: Serve the static bundle
# `serve` is a minimal Node.js static file server — no Nginx needed.
# The -s (single-page app) flag redirects all 404s to index.html,
# which is required for client-side routing (React Router).
FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
