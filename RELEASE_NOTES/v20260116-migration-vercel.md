# Release: Vercel Migration

**Tag:** v20260116-migration-vercel
**Date:** 2026-01-16

## Summary

This release completes the migration from Cloudflare Pages and Netlify to a clean, Vercel‑only deployment pipeline. The project now builds and deploys natively on Vercel with zero adapters, zero YAML deploy workflows, and no external hosting dependencies.

## Highlights

- Removed all Cloudflare Pages configuration and workflows.
- Removed all Netlify deployment workflows and config files.
- Cleaned `next.config.js` to remove Cloudflare-specific overrides.
- Removed `.vercel/output` and other generated artifacts.
- Added annotated migration tag and GitHub release.
- Triggered fresh Vercel deployment to validate the new pipeline.

## Benefits

- Faster, more reliable builds.
- Zero deployment friction.
- Native Next.js hosting environment.
- Cleaner repository and CI pipeline.
- Easier onboarding for future contributors.

## Next Steps

- Continue development with Vercel as the single deployment provider.
- Use semantic versioning for future releases.
- Keep CI focused on linting, type-checking, and tests only.
