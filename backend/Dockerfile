# ── Stage 1: Build ────────────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# ── Stage 2: Production image ─────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy from base
COPY --from=base /app /app

# Create non-root user for security
RUN addgroup -S atithya && adduser -S atithya -G atithya
USER atithya

# Render / Railway / Fly use PORT env var
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-5000}/api/health || exit 1

CMD ["node", "server.js"]
