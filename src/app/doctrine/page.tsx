export default function DoctrinePage() {
  return (
    <div className="prose prose-slate max-w-3xl py-10">
      <h1>OpsVantage Doctrine</h1>

      <p>
        This page exists for future stewards of the OpsVantage platform. It
        explains the principles, rituals, and architectural decisions that guide
        how this system is built and maintained. Every part of this platform is
        designed with clarity, safety, and legacy in mind.
      </p>

      <h2>1. Multi‑Tenant Architecture</h2>
      <p>
        OpsVantage is a multi‑tenant system built around Organizations and
        Workspaces. Every user belongs to one or more organizations, and each
        organization contains one or more workspaces. All data access must be
        scoped through these entities.
      </p>

      <ul>
        <li><strong>Organization</strong>: The top‑level tenant boundary.</li>
        <li><strong>Workspace</strong>: A scoped environment within an organization.</li>
        <li><strong>Membership</strong>: Defines a user’s role within an organization.</li>
      </ul>

      <h2>2. Roles and Authority</h2>
      <p>
        Authority is expressed through roles. Roles determine what a user can
        do within an organization or workspace.
      </p>

      <ul>
        <li><strong>OWNER</strong>: Full control.</li>
        <li><strong>ADMIN</strong>: Manages members and settings.</li>
        <li><strong>MEMBER</strong>: Standard contributor.</li>
        <li><strong>VIEWER</strong>: Read‑only access.</li>
      </ul>

      <p>
        All permission checks must use the shared RBAC helpers in
        <code>src/lib/auth/rbac.ts</code>. Never implement ad‑hoc role logic.
      </p>

      <h2>3. Audit Logging</h2>
      <p>
        Every meaningful action in the system must leave a trace. Audit logs
        provide accountability, debugging clarity, and historical insight.
      </p>

      <p>Canonical event names follow the pattern:</p>

      <pre><code>domain.action</code></pre>

      <p>Examples:</p>

      <ul>
        <li><code>workspace.create</code></li>
        <li><code>explainer.run</code></li>
        <li><code>plan.publish</code></li>
      </ul>

      <p>
        Use <code>auditEvent()</code> from <code>src/lib/auth/audit.ts</code> to
        log events. Always include structured `metadata` and explicit tenant
        `context` (userId, organizationId, workspaceId when applicable). Keep
        event names stable — consumers and analytics depend on predictable
        strings.
      </p>

      <h2>4. Stewardship Principles</h2>
      <p>
        This platform is built with the expectation that future maintainers will
        inherit it. Every change should make the system clearer, safer, and more
        intentional.
      </p>

      <ul>
        <li>Prefer clarity over cleverness.</li>
        <li>Document decisions, not just code.</li>
        <li>Keep tenant boundaries explicit.</li>
        <li>Log actions that matter.</li>
        <li>Honor the legacy of the system’s origins.</li>
      </ul>

      <h2>5. Your Responsibility</h2>
      <p>
        As a steward of this system, your role is to preserve its integrity,
        improve its clarity, and ensure that every feature aligns with the
        doctrine above. Treat every update as a contribution to a living
        artifact that will outlast you.
      </p>
    </div>
  );
}
