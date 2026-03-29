### Database Setup and Migration Commands

**Full setup from scratch:**
```bash
pnpm --filter @workspace/db exec prisma migrate dev --name init && \
pnpm --filter @workspace/db exec prisma db push && \
pnpm --filter @workspace/db exec prisma migrate reset && \
pnpm --filter @workspace/db db:seed
```

**Individual commands:**
```bash
# Generate Prisma client
pnpm --filter @workspace/db exec prisma generate

# Format Prisma schema
pnpm --filter @workspace/db exec prisma format

# Create and run database migration
pnpm --filter @workspace/db exec prisma migrate dev --name init

# Push schema changes to database
pnpm --filter @workspace/db exec prisma db push

# Reset database (destructive - re-runs all migrations and seeds)
pnpm --filter @workspace/db exec prisma migrate reset

# Seed database
pnpm --filter @workspace/db db:seed
```
