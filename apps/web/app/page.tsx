import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Image
        src="/brand-icon.png"
        alt="OpsVantage Digital Brand Icon"
        width={80}
        height={80}
        className="mb-6"
        priority
      />

      <h1 className="text-5xl font-orbitron brand-gradient">
        AI‑YouTube Studio
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-white/90 font-inter">
        Automated, intelligent, and beautifully engineered YouTube content creation.
        Built with precision. Powered by OpsVantage Digital.
      </p>

      <div className="mt-10 flex gap-6">
        <a
          href="/studio"
          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition font-orbitron text-white tracking-wide"
        >
          Enter Studio
        </a>

        <a
          href="https://opsvantagedigital.online"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition font-inter text-white/90"
        >
          Visit OpsVantage Digital
        </a>
      </div>
    </div>
  )
}
