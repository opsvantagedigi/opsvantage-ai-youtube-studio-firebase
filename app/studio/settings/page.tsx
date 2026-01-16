export const dynamic = 'force-dynamic'

export default function StudioSettings() {
  return (
    <div className="mx-auto max-w-4xl p-8" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <h1 className="font-orbitron gradient-heading mb-4 text-2xl">Settings</h1>
      <p className="font-inter text-base text-white/80">
        Studio configuration and account settings.
      </p>
    </div>
  )
}
