### Setup and Migration Commands

```bash
# Generate Prisma client
pnpm --filter backend exec prisma generate

# Format Prisma schema
pnpm --filter backend exec prisma format

# Create and run database migration
pnpm --filter backend exec prisma migrate dev --name init

# Push schema changes to database
pnpm --filter backend exec prisma db push

# Reset database
pnpm --filter backend exec prisma migrate reset
```
