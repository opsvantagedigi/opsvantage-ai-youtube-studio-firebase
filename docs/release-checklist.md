# Release Checklist
> Filename: `docs/release-checklist.md`

Use this checklist when preparing and verifying a release.

- Confirm all PRs merged to `main` have passing CI.
- Update `CHANGELOG.md` or release notes.
- Ensure environment variables in Vercel are current (see `docs/opsvantage-deployment-playbook.md`).
- Run Post‑Deploy Smoke and monitor uptime checks for 30 minutes.
- Notify stakeholders via Slack and update release notes.

### Related docs
- [Deployment Playbook](./opsvantage-deployment-playbook.md)
- [Founder Acceptance Test](./founder-acceptance-test.md)
