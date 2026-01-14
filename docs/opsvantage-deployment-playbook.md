# OpsVantage Deployment Playbook
> Filename: `docs/opsvantage-deployment-playbook.md`

This playbook documents the standard deployment steps, verification checks, and emergency rollback instructions for OpsVantage Shorts Studio.

Deployment (normal)
- Ensure `main` passed CI (PR smoke, tests, lint).
- Update `VERCEL_DEPLOY_URL` in GitHub Secrets if the production domain changes.
- Merge to `main` and let Vercel build and deploy.
- After deploy, run the Post‑Deploy Smoke workflow and verify results.

Rollback
- If a deploy breaks critical functionality, revert the merge or promote the last known good commit.
- Use Vercel to rollback to the previous deployment if merge revert is not possible quickly.

Emergency contacts and access
- Keep the list of people who can approve emergency releases in `/ops/governance.md`.

### Related docs
- [Founder Acceptance Test](./founder-acceptance-test.md)
- [Release Checklist](./release-checklist.md)
- [Disaster Recovery & Rollback](./disaster-recovery-and-rollback.md)
- [Monitoring & Alerting](./monitoring-and-alerting.md)
