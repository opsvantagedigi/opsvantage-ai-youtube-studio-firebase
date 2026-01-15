# Production Locks

To prevent accidental production deploys:

1. In Netlify, go to:
   Site Settings → Build & Deploy → Deploy Controls.
2. Enable "Locked Deploys" for the Production environment.
3. This will require manual approval in the Netlify UI before a new production deploy goes live.

GitHub Actions will still build and upload deploys, but they will remain "locked" until approved.
