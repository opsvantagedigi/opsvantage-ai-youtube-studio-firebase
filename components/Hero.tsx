import Image from 'next/image'

export default function Hero() {
  return (
    <section className="px-6 pb-20 pt-32">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="heading-orbitron mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/5 px-4 py-1.5 text-[10px] uppercase tracking-widest text-green-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          v4.0 Enterprise AI Release
        </div>

        <h1 className="heading-orbitron mb-6 text-6xl font-black leading-[1.1] md:text-8xl">
          Orchestrate <br />
          <span className="brand-gradient-text">Infinite Creativity</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl font-light text-gray-400">
          The first AI video studio built for Fortune 500 standards. Automate scripts, neural
          editing, and brand compliance in one fluid workspace.
        </p>

        <div className="mb-20 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="heading-orbitron rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-transform hover:scale-105">
            Request Demo Access
          </button>
          <button className="glass-card heading-orbitron rounded-full px-8 py-4 text-sm font-bold hover:border-white/40">
            View Case Studies
          </button>
        </div>

        {/* Floating Studio Preview */}
        <div className="perspective-1000 group relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-600/20 to-transparent opacity-50 blur-3xl" />
          <div className="glass-card group-hover:-rotate-x-2 overflow-hidden rounded-2xl border-white/20 shadow-2xl transition-transform duration-700">
            <Image
              src="/studio-preview.png"
              alt="Studio Preview"
              width={1920}
              height={1080}
              className="w-full opacity-90 transition-opacity group-hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
