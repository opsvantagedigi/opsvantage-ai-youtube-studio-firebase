# Founder Acceptance Test — OpsVantage AI-Explainer Engine

Purpose
-------
> Filename: `docs/founder-acceptance-test.md`

This document is a practical, step-by-step acceptance checklist for the founder and future stewards to validate that the OpsVantage AI-Explainer Engine behaves as designed. It focuses on observable behaviors (auth, billing/IPN, gated features, emails, and CI/CD) and provides copy-pasteable commands for local verification.

Preconditions
-------------
Environment requirements (local/dev):

- Node: 20
- Run: `npm ci`
- Database: Postgres reachable from `DATABASE_URL`
- Required env keys in `.env.local` (minimum):
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (e.g. `http://localhost:3000`)
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (if using Google login)
  - `GITHUB_ID` and `GITHUB_SECRET` (if using GitHub login)
  - `EMAIL_SERVER` or `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS` and `EMAIL_FROM`
  - `SLACK_WEBHOOK_URL` (optional, for alerts)
  - `REDIS_URL` (optional)
  - `VERCEL_DEPLOY_URL` (used by post-deploy smoke workflow)

Database migration
------------------
Run migrations and generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Test 1 — App boots and core routes render
-----------------------------------------
Steps

1. Install deps:

```bash
npm ci
```

2. Start dev server:

```bash
npm run dev
```

3. Verify pages in browser (local):

- http://localhost:3000/
- http://localhost:3000/login
- http://localhost:3000/dashboard
- http://localhost:3000/billing/manage
- http://localhost:3000/admin (if present)

Expected results

- Pages load (status 200) for public routes.
- Protected pages redirect to `/login` when not signed in.
- No fatal errors in terminal or browser console.

Test 2 — Auth journey (Google/GitHub)
------------------------------------
Steps

1. Visit http://localhost:3000/login
2. Use Google (or GitHub) login button to sign in.

Expected results

- OAuth flow completes and you are redirected back to the app.
- A `User` row exists in the database for your account.
  - Quick check with Prisma Studio: `npx prisma studio` and open `User` or `Subscription` tables.
- Protected routes now allow access.

Test 3 — Subscription happy path
--------------------------------
Steps

1. Sign in as a normal (non-admin) user.
2. In the dashboard click the Upgrade/Go Pro button to create a NowPayments payment.
3. Complete the test payment (NowPayments sandbox/test flow).
4. Wait for the IPN webhook to arrive (NowPayments will POST to `/api/billing/ipn`).

Expected results

- A `Subscription` row created with `provider = "nowpayments"` and `providerOrderId` set.
- After IPN with `payment_status = "finished"`, the subscription `status` becomes `active`.
- Gated features become available to the user.
- Dashboard shows `Active` subscription status.

Test 4 — Subscription failure / pending paths
---------------------------------------------
Steps (high-level)

1. Simulate IPN payloads with `payment_status` set to `failed` or `waiting` (see Appendix for concrete payloads).

Expected results

- `failed` → subscription `status` becomes `failed` and UI shows an actionable error.
- `waiting`/`confirming`/`partially_paid` → subscription `status` becomes `pending` and UI shows pending messaging.

Test 5 — Email notifications
-----------------------------
Steps

1. Trigger a test email via the app's helper endpoints or send a real subscription success/failure.
2. Inspect the recipient inbox or server logs.

Expected results

- Emails are delivered with branded templates and correct copy.
- For subscription success, a subscription active email is sent; for failure, a failure email is sent.

Test 6 — Admin / Founder visibility
----------------------------------
Steps

1. Promote a user to admin/superuser in the database (update `role` via Prisma Studio).
2. Visit admin/founder routes: e.g. `/admin`, `/admin/billing`, or `/founder` if present.

Expected results

- Admin/founder pages list subscriptions, statuses, and basic metrics (MRR if implemented).
- Health indicators (database, background job status, recent IPN activity) are visible.

Test 7 — CI/CD checks
---------------------
Steps

1. Create a trivial branch and PR against `main`.
2. Observe GitHub Actions:
   - PR Smoke should run on the PR.
   - Post-Deploy Smoke should run after deployments.
3. Optionally trigger `Post Deploy Smoke` via repository dispatch to simulate a Vercel deploy.

Expected results

- Workflows run and complete without YAML or syntax errors.
- Smoke tests report OK for the target URL.

How to evolve this document
---------------------------

- Treat this doc as a contract: update when you add/remove gated features, change authentication, or modify billing flows.
- When adding a new critical route, add a smoke check and an acceptance line here.

### Related docs
- [Deployment Playbook](./opsvantage-deployment-playbook.md)
- [Release Checklist](./release-checklist.md)
- [Disaster Recovery & Rollback](./disaster-recovery-and-rollback.md)
- [Monitoring & Alerting](./monitoring-and-alerting.md)

Appendix: IPN Simulation Guide (Option A)
---------------------------------------

This appendix provides copy-pasteable curl commands to simulate NowPayments IPN payloads against your local or deployed app.

IPN endpoint (local dev):

```
http://localhost:3000/api/billing/ipn
```

Minimal example payload fields used by the app:
- `order_id` (string) — your provider order identifier
- `payment_status` (string) — nowpayments values like `finished`, `waiting`, `confirming`, `failed`, `expired`

Example: Successful / finished payment

```bash
curl -X POST http://localhost:3000/api/billing/ipn \
  -H 'Content-Type: application/json' \
  -d '{
    "order_id": "TEST_ORDER_12345",
    "payment_status": "finished",
    "payment_id": 111222,
    "price_amount": 9.99,
    "price_currency": "USD"
  }'
```

Example: Pending / waiting payment

```bash
curl -X POST http://localhost:3000/api/billing/ipn \
  -H 'Content-Type: application/json' \
  -d '{
    "order_id": "TEST_ORDER_12345",
    "payment_status": "waiting",
    "payment_id": 111223,
    "price_amount": 9.99,
    "price_currency": "USD"
  }'
```

Example: Failed payment

```bash
curl -X POST http://localhost:3000/api/billing/ipn \
  -H 'Content-Type: application/json' \
  -d '{
    "order_id": "TEST_ORDER_12345",
    "payment_status": "failed",
    "payment_id": 111224,
    "price_amount": 9.99,
    "price_currency": "USD"
  }'
```

What to verify after sending an IPN

- Database:
  - Start Prisma Studio: `npx prisma studio` and open the `Subscription` table.
  - Verify there is a row with `provider = "nowpayments"` and `providerOrderId = "TEST_ORDER_12345"`.
  - Confirm the `status` field changed to `active` / `pending` / `failed` according to the payload.

- App UI:
  - Sign in as the subscription owner and check the dashboard shows the updated status.

- Alerts / Slack:
  - If a Slack webhook is configured, confirm the post-deploy or IPN alerts appear in the configured channel when failures occur.

- Emails:
  - Check the recipient mailbox or the SMTP logs to confirm subscription notification emails were sent.

Notes
-----
- The IPN guide assumes the app maps `payment_status` strings to `active`/`pending`/`failed` as implemented in `app/api/billing/ipn/route.ts`.
- Replace `TEST_ORDER_12345` with a real `providerOrderId` if you want to update an existing subscription row. If none exists, create one in the DB so the IPN handler can match it.

Appendix: Quick DB check via psql (optional)

If you prefer raw SQL and have psql:

```bash
psql "$DATABASE_URL" -c "select id, user_id, provider, providerOrderId, status, createdAt from \"Subscription\" order by createdAt desc limit 10;"
```

— End of document
