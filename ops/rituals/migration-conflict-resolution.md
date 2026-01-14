# OPSVANTAGE RITUAL: MIGRATION CONFLICT RESOLUTION

## PURPOSE
Resolve conflicting Prisma migrations created by parallel development branches.

## SYMPTOMS
- Two migrations modify the same table
- Two migrations create the same enum
- Migration order becomes invalid
- Prisma throws P3006 or P3018

## STEPS

### 1. Identify conflicting migrations
Run:

```
git log --name-only
git diff main...HEAD prisma/migrations
```

Record:

- Migration names
- Tables affected
- Enum changes

### 2. Determine the canonical migration order
Rules:

- Schema-wide changes first (enums, new tables)
- Table modifications second
- Foreign keys last

### 3. Merge migrations manually
Actions:

- Combine CREATE TABLE statements
- Combine ALTER TABLE statements
- Remove duplicates
- Ensure deterministic ordering

### 4. Regenerate a single unified migration
Run:

```
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > unified.sql
```

### 5. Replace conflicting migrations with unified.sql
Actions:

- Delete old migration folders
- Create new migration folder
- Insert unified.sql

### 6. Validate unified migration
Run:

```
npx prisma migrate deploy --preview-feature
```

Expected:

- No errors
- No drift

### 7. Commit and push
Record:

- Engineer name
- Conflict summary
- Resolution steps
