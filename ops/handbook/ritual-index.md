Ritual Index

Core Rituals
- Pre‑Migration Ritual: Validate environment, confirm backups, verify no uncommitted migrations, and ensure `DATABASE_URL` points to the intended target.
- Migration Ritual: Apply migrations deterministically with `npx prisma migrate deploy` and monitor for errors.
- Post‑Migration Validation: Run schema checks, enum checks, FK verification, Prisma Client generation, and smoke tests.
- Rollback Ritual: Restore from backup and document the rollback when a migration fails.
- Conflict Resolution Ritual: Resolve and unify colliding migrations with deterministic ordering.

Operational Rituals
- Deployment Ritual: Build, migrate, seed (optional), and smoke test before promoting to production.
- Incident Response Ritual: Detect, contain, diagnose, resolve, and document incidents.
- Backup & Restore Ritual: Schedule automated backups and periodically test restores.

Auxiliary Rituals
- Seed Ritual: Seed deterministic upserts for safe environment bootstrapping.
- Audit Ritual: Record migration runs, approvals, and post‑validation status in the Ops Log.

How to use this index
- Each ritual has a checklist-style document under `ops/rituals/`.
- Follow the checklist exactly for the environment you are operating in (development, preview, production).
- When in doubt, escalate to the Governance Council for guidance.
