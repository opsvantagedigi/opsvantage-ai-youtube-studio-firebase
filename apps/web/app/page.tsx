import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeatureGrid from '@/components/FeatureGrid'
import EnterpriseSection from '@/components/EnterpriseSection'

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Dynamic Background Glows */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] top-[20%] h-[40%] w-[40%] rounded-full bg-yellow-500/5 blur-[120px]" />

      <Navbar />

      <main className="relative z-10">
        <Hero />

        {/* Social Proof Bar */}
        <section className="border-y border-white/5 bg-black/40 py-12 backdrop-blur-sm">
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-12 px-6 opacity-40 grayscale transition-all hover:grayscale-0">
            <span className="heading-orbitron text-xl font-bold">NETFLIX</span>
            <span className="heading-orbitron text-xl font-bold">SONY</span>
            <span className="heading-orbitron text-xl font-bold">ADOBE</span>
            <span className="heading-orbitron text-xl font-bold">YOUTUBE</span>
          </div>
        </section>

        <FeatureGrid />
        <EnterpriseSection />
      </main>

      <footer className="border-t border-white/5 py-20 text-center">
        <p className="text-sm text-gray-500">
          © 2026 AI-YouTube Studio. Built for the Next Era of Content.
        </p>
      </footer>
    </div>
  )
}
