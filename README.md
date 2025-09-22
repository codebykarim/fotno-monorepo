### Setup and Migration Commands

```bash
# Generate Prisma client
pnpm dlx prisma generate

# Format Prisma schema
pnpm dlx prisma format

# Create and run database migration
pnpm dlx prisma migrate --name init

# Push schema changes to database
pnpm dlx prisma db push
```
