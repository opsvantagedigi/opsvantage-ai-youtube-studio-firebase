# Supabase CLI (repo helper)

This repository includes helper scripts to install the Supabase CLI for local development.

Files:

- `scripts/install-supabase.ps1` — PowerShell helper (Windows)
- `scripts/install-supabase.sh` — POSIX shell helper (macOS/Linux/WSL)

Recommended usage:

PowerShell (Windows):

```powershell
./scripts/install-supabase.ps1
```

POSIX shell (macOS / Linux / WSL):

```bash
./scripts/install-supabase.sh
```

Both scripts will attempt to use `pnpm` to add the CLI to the workspace devDependencies; if `pnpm` is not available they fall back to `npm i -g supabase`.

If you prefer system package managers, follow the official docs: https://supabase.com/docs/reference/cli
