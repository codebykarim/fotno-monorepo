FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./

# Copy all package.json files for pnpm workspace resolution
COPY packages/db/package.json packages/db/
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
COPY apps/image-search-service/package.json apps/image-search-service/
COPY apps/image-processor/package.json apps/image-processor/

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy workspace packages source
COPY packages/ packages/

# Copy app source
COPY apps/landing/ apps/landing/

# Generate Prisma client and build Next.js
RUN pnpm --filter @workspace/db db:generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/landing && pnpm build

# --- Production runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output (includes minimal node_modules and monorepo structure)
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./

# Copy static assets and public files
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/landing/public ./apps/landing/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/landing/server.js"]
