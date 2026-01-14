# OPSVANTAGE RITUAL: PRE‑MIGRATION CHECKLIST

## PURPOSE
Before applying any Prisma migration, confirm that the environment, schema, and codebase
are in a safe and deterministic state. This prevents corruption, drift, and production
downtime.

## PRECONDITIONS
- Engineer has reviewed the migration diff.
- Engineer understands the impact on existing data.
- Engineer has authority to modify the database.

## STEPS

### 1. Confirm correct environment
Run:

```
echo $Env:DATABASE_URL
```

Expected:

- Points to the correct Neon instance
- Points to the correct schema

### 2. Validate Prisma schema
Run:

```
npx prisma validate
```

Expected:

- “The Prisma schema is valid”

### 3. Check for schema drift
Run:

```
npx prisma db pull
```

Expected:

- No drift warnings
- No unexpected changes

### 4. Confirm migration files are committed
Run:

```
git status
```

Expected:

- No uncommitted migration files
- No pending schema changes

### 5. Backup production data (if applicable)
Run:

```
neonctl backup create
```

Expected:

- Backup ID recorded in Ops Log

### 6. Announce migration window (if production)
Record:

- Engineer name
- Migration name
- Expected impact
- Start time

### 7. Proceed to migration
Run:

```
npx prisma migrate deploy
```

## SUCCESS CRITERIA
- No drift
- No uncommitted changes
- Backup created
- Migration window logged
