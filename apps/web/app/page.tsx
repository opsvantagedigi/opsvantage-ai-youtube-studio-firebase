import Image from 'next/image';

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8 font-inter text-white"
      style={{ background: 'var(--background)' }}
    >
      <Image
        src="/brand-icon.png"
        alt="OpsVantage Logo"
        width={96}
        height={96}
        className="mb-6"
        priority
      />

      <h1 className="text-4xl font-orbitron gradient-heading mb-4">AI-YouTube Studio</h1>

      <p className="text-lg text-center max-w-xl mb-6 text-white/80">
        Automated, intelligent, and beautifully engineered YouTube content creation. Built with
        precision. Powered with OpsVantage Digital.
      </p>

      <div className="flex gap-4">
        <a href="/studio" className="btn-primary">
          Enter Studio
        </a>
        <a href="https://opsvantagedigital.online" className="btn-outline">
          Visit OpsVantage Digital
        </a>
      </div>
    </main>
  );
}
