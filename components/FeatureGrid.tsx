export default function FeatureGrid() {
  const features = [
    {
      title: 'Neural Scripting',
      desc: 'AI that learns your brand voice.',
      col: 'col-span-12 md:col-span-8',
      color: 'from-blue-600',
    },
    {
      title: 'Smart B-Roll',
      desc: 'Instant visual sourcing.',
      col: 'col-span-12 md:col-span-4',
      color: 'from-green-500',
    },
    {
      title: 'ROI Forecast',
      desc: 'Predict engagement.',
      col: 'col-span-12 md:col-span-4',
      color: 'from-yellow-400',
    },
    {
      title: 'Brand Guardrails',
      desc: '100% compliant, every frame.',
      col: 'col-span-12 md:col-span-8',
      color: 'from-blue-400',
    },
  ]

  return (
    <section className="container mx-auto px-6 py-24">
      <h2 className="heading-orbitron mb-12 text-center text-3xl">
        Built for <span className="text-gray-500">Scale</span>
      </h2>
      <div className="grid grid-cols-12 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className={`${f.col} glass-card group relative overflow-hidden rounded-3xl p-8`}
          >
            <div
              className={`absolute right-0 top-0 h-32 w-32 bg-gradient-to-br ${f.color} to-transparent opacity-10 blur-2xl transition-opacity group-hover:opacity-30`}
            />
            <h3 className="heading-orbitron mb-2 text-lg">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
            <div className="mt-8 h-40 w-full rounded-xl border border-white/5 bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  )
}
