export default function EnterpriseSection() {
  return (
    <section id="enterprise" className="border-t border-white/5 bg-black/40 px-6 py-24">
      <div className="container mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2">
        <div>
          <h2 className="heading-orbitron mb-4 text-3xl">Enterprise-Grade by Design</h2>
          <p className="mb-6 text-sm text-gray-400">
            AI-YouTube Studio is built for teams that can’t afford guesswork. From audit trails to
            brand guardrails, every workflow is designed for compliance, scale, and global reach.
          </p>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>• SSO & role-based access</li>
            <li>• Brand guideline enforcement</li>
            <li>• API access for existing content pipelines</li>
            <li>• Region-aware publishing and approvals</li>
          </ul>
        </div>
        <div className="glass-card rounded-3xl p-8">
          <h3 className="heading-orbitron mb-4 text-lg">Compliance & Control</h3>
          <p className="mb-6 text-sm text-gray-400">
            Plug AI-YouTube Studio into your existing governance stack and keep every asset on
            brand, on message, and on record.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
            <div>
              <p className="mb-1 text-gray-500">Security</p>
              <p>Audit logs, access policies, encrypted storage.</p>
            </div>
            <div>
              <p className="mb-1 text-gray-500">Integrations</p>
              <p>Slack, Drive, DAMs, and internal tools.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
