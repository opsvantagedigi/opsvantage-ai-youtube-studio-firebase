# Monitoring & Alerting
> Filename: `docs/monitoring-and-alerting.md`

This document describes the monitoring and alerting posture for OpsVantage Shorts Studio.

Key checks
- Health endpoint: `/api/health` — should return 200 and basic subsystem status.
- Uptime workflow: scheduled GitHub Action to hit the production URL and alert on failures.
- Post‑deploy smoke: runs after deploy to verify landing, login, and dashboard redirects.

Alerting
- Critical alerts post to the configured Slack webhook. Configure `SLACK_WEBHOOK_URL` in Vercel.

### Related docs
- [Founder Acceptance Test](./founder-acceptance-test.md)
- [Deployment Playbook](./opsvantage-deployment-playbook.md)
