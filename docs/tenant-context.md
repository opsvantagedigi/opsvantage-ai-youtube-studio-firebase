# Tenant Context (OpsVantage)

This document describes the tenant context model and how client components should consume it.

## Tenant snapshot
- `user`: current authenticated user (id, email, name, globalRole)
- `orgs`: organizations the user is a member of (id, name, slug, role)
- `activeOrg`: currently selected organization
- `workspaces`: workspaces for the active org (id, name, organizationId, role)
- `activeWorkspace`: currently selected workspace

## Usage
Wrap org-scoped layouts with `TenantProvider` and pass the initial snapshot gathered server-side.

Client components can use the `useTenant()` hook to read the current tenant state and change active org/workspace.

## Persisting active selection
- On select, provider navigates to org/workspace URLs.
- Optionally call an API route to persist selection to the user's session/JWT.
