# OpsVantage Audit Events

This document lists canonical audit event names and their intended usage.

## Naming convention
- Dot-separated: `<domain>.<action>`
- Actions are imperative / present tense: `create`, `update`, `delete`, `switch`, etc.

## Core events

### Identity & access
- `user.signup`
- `user.login`
- `user.logout`
- `user.role.change`
- `user.invite.send`
- `user.invite.accept`
- `user.org.join`
- `user.org.leave`

### Organization
- `organization.create`
- `organization.update`
- `organization.delete`
- `organization.member.add`
- `organization.member.remove`
- `organization.member.role.change`

### Workspace
- `workspace.create`
- `workspace.update`
- `workspace.delete`
- `workspace.member.add`
- `workspace.member.remove`
- `workspace.member.role.change`
- `workspace.switch`
- `workspace.archive`
- `workspace.restore`

### Explainer engine
- `explainer.create`
- `explainer.update`
- `explainer.delete`
- `explainer.run`
- `explainer.share`
- `explainer.version.create`
- `explainer.version.restore`

### Plans / content
- `plan.create`
- `plan.update`
- `plan.publish`
- `plan.unpublish`
- `plan.clone`

### System / safety
- `secrets.update`
- `webhook.configure`
- `webhook.trigger`
- `api.key.create`
- `api.key.revoke`
- `deployment.create`
- `deployment.rollback`

## Examples
- When a user switches workspace: `workspace.switch`, metadata: `{ fromWorkspaceId, toWorkspaceId }`.
- When a plan is published: `plan.publish`, metadata: `{ planId, version }`.
