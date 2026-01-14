# Disaster Recovery & Rollback
> Filename: `docs/disaster-recovery-and-rollback.md`

High-level guidance for recovering from severe incidents.

Immediate steps
- Triage and classify the incident severity.
- If the issue is a bad deploy, revert the offending merge or rollback in Vercel.
- If the database is affected, restore from the most recent known-good backup and apply migrations carefully.

Recovery checklist
- Communicate to stakeholders and pause incoming releases.
- Run the Founder Acceptance Test after recovery to confirm core flows.

### Related docs
- [Monitoring & Alerting](./monitoring-and-alerting.md)
- [Deployment Playbook](./opsvantage-deployment-playbook.md)
