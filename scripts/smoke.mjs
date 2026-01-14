#!/usr/bin/env node

import fetch from "node-fetch";

const DEPLOY_URL = process.env.DEPLOY_URL || process.argv[2];
if (!DEPLOY_URL) {
  console.error("❌ DEPLOY_URL not set. Usage: DEPLOY_URL=https://... node scripts/smoke.mjs");
  process.exit(1);
}

function green(msg) { return `\x1b[32m${msg}\x1b[0m` }
function yellow(msg) { return `\x1b[33m${msg}\x1b[0m` }
function red(msg) { return `\x1b[31m${msg}\x1b[0m` }

async function fetchText(path, opts = {}) {
  const url = `${DEPLOY_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, { redirect: "manual", ...opts });
  const text = await res.text().catch(() => "");
  return { res, text };
}

async function checkLanding() {
  const { res, text } = await fetchText("/");
  if (res.status !== 200) {
    console.error(`FAIL: GET / — expected 200, got ${res.status}`);
    return false;
  }
  const ok = /OpsVantage|AI-Explainer|OpsVantage AI-Explainer Engine/i.test(text);
  if (!ok) console.error(`FAIL: GET / — body missing expected branding`);
  else console.log(green(`OK: GET / — 200 and branding present`));
  return ok;
}

async function checkLogin() {
  const { res, text } = await fetchText("/login");
  if (res.status !== 200) {
    console.error(`FAIL: GET /login — expected 200, got ${res.status}`);
    return false;
  }
  const ok = /Continue with Google|Continue with GitHub|Sign in/i.test(text);
  if (!ok) console.error(`FAIL: GET /login — login UI not detected`);
  else console.log(green(`OK: GET /login — login UI detected`));
  return ok;
}

async function checkDashboardRedirect() {
  const { res, text } = await fetchText("/dashboard");
  if (res.status >= 300 && res.status < 400) {
    const loc = res.headers.get("location") || "";
    const ok = loc.includes("/login") || loc.includes("/auth");
    if (!ok) {
      console.error(`FAIL: GET /dashboard — redirected to unexpected location: ${loc}`);
      return false;
    }
    console.log(yellow(`OK: GET /dashboard — unauthenticated redirect (${res.status}) → ${loc}`));
    return true;
  }
  if (res.status === 200) {
    const ok = /Sign in|Continue with Google|Dashboard/i.test(text);
    if (!ok) console.error(`FAIL: GET /dashboard — expected redirect or sign-in, got 200 without sign-in UI`);
    else console.log(green(`OK: GET /dashboard — 200 with sign-in UI`));
    return ok;
  }
  console.error(`FAIL: GET /dashboard — unexpected status ${res.status}`);
  return false;
}

async function checkApiAiExplainer() {
  const payload = JSON.stringify({ prompt: "smoke-test", niche: "smoke" });
  const { res } = await fetchText("/api/ai-explainer", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload });
  const ok = [200, 401, 403].includes(res.status);
  if (!ok) console.error(`FAIL: POST /api/ai-explainer — expected 200/401/403, got ${res.status}`);
  else console.log(green(`OK: POST /api/ai-explainer — ${res.status}`));
  return ok;
}

(async () => {
  console.log(`\n🔍 OpsVantage Smoke Tests — Target: ${DEPLOY_URL}\n`);
  const checks = [checkLanding, checkLogin, checkDashboardRedirect, checkApiAiExplainer];
  let failures = 0;
  for (const fn of checks) {
    try { const ok = await fn(); if (!ok) failures++; }
    catch (err) { console.error(red(`ERROR running check: ${err?.message ?? err}`)); failures++; }
  }
  console.log("\n──────────────────────────────");
  if (failures === 0) { console.log(green("🎉 All smoke tests passed — deployment is healthy.")); process.exit(0); }
  console.error(red(`⚠️  ${failures} smoke check(s) failed.`));
  process.exit(1);
})();