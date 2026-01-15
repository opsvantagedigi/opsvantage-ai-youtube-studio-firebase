# Environment Variables

This project uses Netlify for hosting and NextAuth for authentication.

## Required Environment Variables (Netlify)

Set these in the Netlify UI for each environment (Production, Deploy Preview, Staging):

- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NETLIFY_AUTH_TOKEN (for GitHub Actions deploys)
- NETLIFY_SITE_ID (for GitHub Actions deploys)

## Local Development (.env.local)

Create apps/web/.env.local with:

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-local-dev-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

Do NOT commit .env.local to Git.

## GitHub Actions Secrets

Set these in your GitHub repository settings under "Secrets and variables":

- NETLIFY_AUTH_TOKEN
- NETLIFY_SITE_ID

## Security Best Practices (Fortune 500 Standard)

- **Never commit secrets to source control.**
- **Rotate secrets regularly** (at least quarterly, or immediately if compromised).
- **Restrict access** to secrets in Netlify and GitHub to only trusted team members.
- **Audit secret usage** and access logs periodically.
- **Use strong, randomly generated secrets** (minimum 32 characters for NEXTAUTH_SECRET).
- **Enable 2FA** for all Netlify and GitHub accounts.
- **Document all secret changes and rotations** in internal change logs.
- **Review and update environment variables for every new environment or branch.**
- **Comply with all relevant regulations** (GDPR, SOC2, etc.) for secret management and access.

## Sync Strategy

- Production: Set in Netlify → Site Settings → Environment Variables.
- Staging: Use the same keys with different values if needed.
- Deploy Previews: Inherit from Production unless overridden.
- GitHub Actions: Set NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID in repo secrets.

## Audit & Compliance

- Maintain a record of all environment variable changes and rotations.
- Periodically review access permissions in Netlify and GitHub.
- Use Netlify and GitHub audit logs for compliance reporting.
