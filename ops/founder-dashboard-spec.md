# Founder Dashboard Spec
This file describes the purpose and initial surface area for `/founder`.

Initial view
- System Status: health check result and deployment metadata (commit sha, Vercel URL).
- Subscriptions Summary: counts for active / pending / failed, and an MRR estimate if plan price known.
- Recent Billing Events: last 5 IPN events (status, order id, timestamp).
- Quick links: docs and CI pages (PR Smoke, Post‑Deploy Smoke, Uptime).

Access
- Restricted to users with `role` of `admin` or `founder`.

Evolution
- Add charts and trends, alerting subscriptions, and exportable CSV of recent billing events.

Related: `docs/founder-acceptance-test.md`, `docs/monitoring-and-alerting.md`
