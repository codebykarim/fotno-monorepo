FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate && npm install -g tsx

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

# Copy app source (image-processor has cross-app imports into backend and upload-service)
COPY apps/image-processor/ apps/image-processor/
COPY apps/backend/ apps/backend/
COPY apps/upload-service/ apps/upload-service/

# Generate Prisma client and build
RUN pnpm --filter @workspace/db db:generate
RUN cd apps/image-processor && pnpm build

ENV NODE_ENV=production
WORKDIR /app/apps/image-processor

# No HTTP port — this is a background polling worker
# Run source directly via tsx — cross-app relative imports need source, not compiled dist/
CMD ["tsx", "src/index.ts"]
