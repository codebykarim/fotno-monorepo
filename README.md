### Setup and Migration Commands

```bash
# Generate Prisma client
pnpm --filter @workspace/db exec prisma generate

# Format Prisma schema
pnpm --filter @workspace/db exec prisma format

# Create and run database migration
pnpm --filter @workspace/db exec prisma migrate dev --name init

# Push schema changes to database
pnpm --filter @workspace/db exec prisma db push

# Reset database
pnpm --filter @workspace/db exec prisma migrate reset
```
