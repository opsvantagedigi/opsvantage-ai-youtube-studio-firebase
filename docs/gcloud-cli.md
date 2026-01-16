# Google Cloud SDK (gcloud) — repo helper

This repository includes helper scripts to install the Google Cloud SDK (`gcloud`) for local development.

Files:

- `scripts/install-gcloud.ps1` — PowerShell helper (Windows)
- `scripts/install-gcloud.sh` — POSIX shell helper (macOS/Linux/WSL)

Usage examples:

PowerShell (Windows):

```powershell
./scripts/install-gcloud.ps1
```

POSIX shell (macOS / Linux / WSL):

```bash
./scripts/install-gcloud.sh
```

Notes:

- Scripts attempt to use common package managers (Homebrew, apt, Chocolatey, winget, scoop).
- If no package manager is available, follow the official installation guide: https://cloud.google.com/sdk/docs/install
