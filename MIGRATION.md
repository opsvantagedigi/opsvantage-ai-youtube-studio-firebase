# Migration: Cloudflare + Netlify Removal → Vercel‑Only Deployment

**Date:** 2026-01-16
**Tag:** `v20260116-migration-vercel`

## Overview

This document records the migration of the AI‑YouTube‑Studio platform from a mixed Cloudflare/Netlify deployment setup to a clean, Vercel‑only hosting model. The goal was to simplify CI/CD, remove redundant infrastructure, and align the project with the native Next.js deployment environment.

Vercel now serves as the **single source of truth** for builds, previews, and production deployments.

---

## Why the Migration Was Necessary

- Cloudflare Pages required complex adapters (`next-on-pages`) and monorepo path overrides.
- Windows-based development introduced spawn/child-process issues with Cloudflare’s build pipeline.
- Netlify workflows were still active and interfering with CI.
- The project needed a stable, frictionless deployment pipeline to accelerate feature development.

Vercel provides:

- Zero‑config Next.js support
- Automatic monorepo detection
- Predictable builds
- No YAML workflows required
- Instant previews and production deploys

---

## What Was Removed

### Cloudflare Artifacts

- `.github/workflows/cloudflare-pages.yml`
- `wrangler.toml`
- `.dev.vars`
- `.vercel/output/` (generated)
- Cloudflare‑specific fields in `apps/web/next.config.js`:
  - `turbopack.root`
  - `outputFileTracingRoot`
  - `distDir` overrides
  - Any Next‑on‑Pages adapter config

### Netlify Artifacts

- `.github/workflows/netlify-deploy.yml`
- `netlify.toml`
- `.netlify/` directory (if present)
- Netlify CLI references
- Netlify redirect files (if not required by app logic)

---

## What Was Added or Updated

- Clean, minimal `next.config.js` compatible with Vercel.
- Git tag + GitHub release: `v20260116-migration-vercel`
- Empty commit to trigger fresh Vercel deployment.
- Repository now contains **no Cloudflare or Netlify deployment logic**.

---

## Deployment Model Going Forward

### **Vercel is the only deployment provider.**

- Push to `main` → Vercel builds → Vercel deploys
- No GitHub Actions required
- No adapters
- No wrangler
- No Netlify CLI

---

## Notes for Future Maintainers

- Avoid reintroducing Cloudflare Pages or Netlify workflows unless the architecture changes.
- If DNS is moved, Cloudflare DNS is fine — but hosting stays on Vercel.
- Keep `next.config.js` minimal unless a feature explicitly requires configuration.

---

## Migration Completed Successfully

This migration simplifies the platform, reduces CI friction, and aligns the project with the most stable Next.js hosting environment.
