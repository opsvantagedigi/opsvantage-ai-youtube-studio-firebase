# Rollback Strategy

Netlify supports instant rollbacks:

1. Go to the Netlify dashboard for the site.
2. Open the "Deploys" tab.
3. Find the last known good deploy.
4. Click "Rollback to this deploy".

This will instantly restore the previous version without a new build.

For GitHub:

- Tag important releases (e.g., v1.0.0).
- If needed, revert via:
  git revert <commit-sha>
  git push

Then Netlify will build and deploy the reverted state.
