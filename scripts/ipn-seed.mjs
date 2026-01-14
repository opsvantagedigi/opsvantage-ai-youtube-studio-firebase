#!/usr/bin/env node
import fetch from 'node-fetch';

const DEPLOY_URL = process.env.DEPLOY_URL || process.argv[2] || 'http://localhost:3000';
if (!DEPLOY_URL) {
  console.error('Usage: DEPLOY_URL=http://localhost:3000 node scripts/ipn-seed.mjs <userId> <orderId> [status]');
  process.exit(1);
}

const userId = process.argv[3] || process.env.TEST_USER_ID;
const orderId = process.argv[4] || `TEST_ORDER_${Date.now()}`;
const status = process.argv[5] || 'finished';

if (!userId) {
  console.error('Please provide a userId as the first argument or set TEST_USER_ID env var');
  process.exit(1);
}

async function seed() {
  console.log(`Seeding subscription for user ${userId} -> order ${orderId} on ${DEPLOY_URL}`);
  // create subscription row via dev-only endpoint
  const seedRes = await fetch(`${DEPLOY_URL.replace(/\/$/, '')}/api/billing/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, providerOrderId: orderId, price: 9.99, currency: 'USD' }),
  });

  if (!seedRes.ok) {
    console.error('Seed failed:', await seedRes.text());
    process.exit(1);
  }
  const seedJson = await seedRes.json();
  console.log('Seed response:', seedJson);

  // call IPN
  console.log(`Posting IPN status=${status}`);
  const ipnRes = await fetch(`${DEPLOY_URL.replace(/\/$/, '')}/api/billing/ipn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, payment_status: status, payment_id: Date.now() }),
  });
  const ipnText = await ipnRes.text();
  console.log('IPN response status:', ipnRes.status, ipnText);
  if (!ipnRes.ok) process.exit(1);
  console.log('Done. Verify via Prisma Studio or the dashboard.');
}

seed().catch((e) => { console.error(e); process.exit(1); });
