# syntax=docker/dockerfile:1.9.0

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Build-time arguments (passed from CI)
ARG POSTGRES_USER
ARG POSTGRES_DB
ARG OUTLINE_API_URL
ARG OUTLINE_FINGERPRINT
ARG HOST_IP
ARG DOCKER_USERNAME

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy Prisma schema and generate client
COPY schema.prisma ./schema.prisma
# Use BuildKit secret for DATABASE_URL during prisma generate
RUN --mount=type=secret,id=DATABASE_URL sh -c "export DATABASE_URL=\$(cat /run/secrets/DATABASE_URL) && npx prisma generate"

# Rebuild the source code only when needed
FROM base AS builder
# Build-time arguments (passed from CI)
ARG POSTGRES_USER
ARG POSTGRES_DB
ARG OUTLINE_API_URL
ARG OUTLINE_FINGERPRINT
ARG HOST_IP
ARG DOCKER_USERNAME

# Make non-sensitive args available during build
ENV POSTGRES_USER=${POSTGRES_USER} \
    POSTGRES_DB=${POSTGRES_DB} \
    OUTLINE_API_URL=${OUTLINE_API_URL} \
    OUTLINE_FINGERPRINT=${OUTLINE_FINGERPRINT} \
    HOST_IP=${HOST_IP} \
    DOCKER_USERNAME=${DOCKER_USERNAME}

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure public directory exists even if empty, so later COPY won't fail
RUN mkdir -p public

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=DATABASE_URL --mount=type=secret,id=API_KEY sh -c "\
  export DATABASE_URL=\$(cat /run/secrets/DATABASE_URL); \
  export API_KEY=\$(cat /run/secrets/API_KEY); \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo 'Lockfile not found.' && exit 1; \
  fi"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Accept the same build-time args in the final stage (optional)
ARG POSTGRES_USER
ARG POSTGRES_DB
ARG DATABASE_URL
ARG OUTLINE_API_URL
ARG OUTLINE_FINGERPRINT
ARG HOST_IP
ARG DOCKER_USERNAME

# Provide default runtime envs (can be overridden by docker-compose)
ENV POSTGRES_USER=${POSTGRES_USER} \
    POSTGRES_DB=${POSTGRES_DB} \
    DATABASE_URL=${DATABASE_URL} \
    OUTLINE_API_URL=${OUTLINE_API_URL} \
    OUTLINE_FINGERPRINT=${OUTLINE_FINGERPRINT} \
    HOST_IP=${HOST_IP} \
    DOCKER_USERNAME=${DOCKER_USERNAME}

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
