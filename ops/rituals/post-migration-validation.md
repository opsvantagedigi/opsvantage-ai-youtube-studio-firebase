# OPSVANTAGE RITUAL: POST‑MIGRATION VALIDATION

Purpose:
Ensure that after any Prisma migration is applied, the database is structurally sound, queryable, and ready for production traffic.

PRECONDITIONS
- Migration has been applied using:
  npx prisma migrate deploy

- No errors were reported during migration.

- DATABASE_URL points to the correct Neon instance.

VALIDATION STEPS

1. Validate Prisma Client Generation

Run:

```
npx prisma generate
```

Expected:

“Prisma Client generated successfully.”

2. Validate Database Connectivity

Run:

```
npx prisma db pull
```

Expected:

No schema drift

No warnings

No missing tables

3. Validate Table Existence

Run:

```
echo "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" | npx prisma db execute --stdin
```

Expected:  
All expected tables appear:

- User
- Workspace
- Subscription
- SubscriptionPlan
- UserWorkspaceMembership
- Niche
- ContentPlan
- ShortVideo
- YouTubeChannelConfig
- AuditLog

4. Validate Enum Existence

Run:

```
echo "SELECT typname FROM pg_type WHERE typname IN ('userrole','subscriptionstatus','workspacerole','timeframe','shortvideostatus');" | npx prisma db execute --stdin
```

Expected:  
All enums present.

5. Validate Foreign Keys

Run:

```
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY';
```

Expected:  
All FK constraints appear with no missing references.

6. Validate Seed Script Execution

Run:

```
npx ts-node prisma/seed.ts
```

Expected:

No errors

Seed data created

Admin user exists

Workspace exists

Niche exists

ContentPlan exists

ShortVideo exists

7. Validate Application Boot

Start your dev server:

```
npm run dev
```

Expected:

No Prisma errors

No missing table errors

No migration drift warnings

SUCCESS CRITERIA

The migration is considered validated when:

- All tables exist
- All enums exist
- All foreign keys exist
- Prisma Client generates cleanly
- Seed script runs without error
- Application boots without error

POST‑RITUAL ACTION

Record the validation in the Ops Log:

```
[DATE] — Migration 20260113_add-subscription-model validated successfully.
Performed by: <engineer>
Environment: Production / Preview / Development
Notes: No anomalies detected.
```

Then:
1. test your API endpoints
2. verify your Prisma client
3. run a health check
