Applying the generated SQL migration to Neon

Files created:
- `prisma_migration.sql` — SQL created from Prisma schema, contains enums, tables, indexes, and FKs.

Options to apply the SQL to your Neon database:

- Use Neon SQL Editor (recommended)
- Open your Neon project dashboard.
- Go to "SQL" > "Editor".
- Create a new query, paste the contents of `prisma_migration.sql` and run it.

2) psql (command line)
- From your machine with network access to Neon, run:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@your-neon-host:5432/postgres" -f prisma_migration.sql
```

3) pgAdmin or TablePlus
- Connect to your Neon Postgres using the connection string.
- Run the SQL file via the query editor.

Notes and warnings:
- The SQL creates enum types. If your DB already has conflicting objects, review and adjust the SQL first.
- For production, prefer using Prisma Migrate with migrations directories. This SQL is a one-time apply to bring the DB schema in sync.

After applying the SQL:
- Run the seed script to create the admin user and OpsVantage workspace:

```bash
npm install
npx prisma generate
npx prisma db seed
```

If you prefer I generate a SQL file only for the seed data (INSERTs), tell me and I will produce it.
