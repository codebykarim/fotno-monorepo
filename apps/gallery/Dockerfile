FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./

# Copy all package.json files for pnpm workspace resolution
COPY packages/db/package.json packages/db/
COPY packages/db/prisma.config.ts packages/db/
COPY packages/db/prisma/schema.prisma packages/db/prisma/
COPY packages/lib/package.json packages/lib/
COPY packages/ui/package.json packages/ui/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY apps/backend/package.json apps/backend/
COPY apps/landing/package.json apps/landing/
COPY apps/dashboard/package.json apps/dashboard/
COPY apps/auth/package.json apps/auth/
COPY apps/gallery/package.json apps/gallery/
COPY apps/admin/package.json apps/admin/
COPY apps/upload-service/package.json apps/upload-service/
COPY apps/image-processor/package.json apps/image-processor/

# Install dependencies (DIRECT_URL needed by prisma generate postinstall, dummy value for build)
ARG DIRECT_URL="postgresql://build:build@localhost:5432/build"
RUN pnpm install --frozen-lockfile

# Copy workspace packages source
COPY packages/ packages/

# Copy app source
COPY apps/gallery/ apps/gallery/

# Generate Prisma client and build Next.js
RUN pnpm --filter @workspace/db db:generate
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_DASHBOARD_URL
ARG NEXT_PUBLIC_GALLERY_URL
ARG NEXT_PUBLIC_LANDING_URL
ARG BACKEND_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_AUTH_URL=${NEXT_PUBLIC_AUTH_URL}
ENV NEXT_PUBLIC_DASHBOARD_URL=${NEXT_PUBLIC_DASHBOARD_URL}
ENV NEXT_PUBLIC_GALLERY_URL=${NEXT_PUBLIC_GALLERY_URL}
ENV NEXT_PUBLIC_LANDING_URL=${NEXT_PUBLIC_LANDING_URL}
ENV BACKEND_API_URL=${BACKEND_API_URL}
RUN cd apps/gallery && NODE_OPTIONS="--max-old-space-size=81924096" pnpm build

# --- Production runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG BACKEND_API_URL
ARG NEXT_PUBLIC_API_URL
ENV BACKEND_API_URL=${BACKEND_API_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/gallery/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/gallery/.next/static ./apps/gallery/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/gallery/public ./apps/gallery/public

USER nextjs

EXPOSE 3003
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/gallery/server.js"]
