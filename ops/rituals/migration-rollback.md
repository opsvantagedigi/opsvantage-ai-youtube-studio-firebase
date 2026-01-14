# OPSVANTAGE RITUAL: MIGRATION ROLLBACK

## PURPOSE
Restore the database to a known-good state after a failed or harmful migration.

## PRECONDITIONS
- Migration failure detected OR post-migration validation failed.
- Backup exists for the environment.
- Engineer has authority to perform rollback.

## STEPS

### 1. Identify the failed migration
Run:

```
SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC;
```

Record:

- Migration name
- Timestamp
- Error logs

### 2. Stop application traffic (if production)
Actions:

- Disable API routes
- Pause background workers
- Notify team

### 3. Restore from backup
Run:

```
neonctl backup restore --backup-id <ID>
```

Expected:

- Database restored to pre-migration state

### 4. Verify restore
Run:

```
npx prisma db pull
```

Expected:

- Schema matches expected pre-migration state

### 5. Re-enable application traffic
Actions:

- Re-enable API routes
- Resume workers

### 6. Log rollback event
Record:

- Engineer name
- Migration name
- Backup ID
- Root cause summary
