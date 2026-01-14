import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center justify-center p-8 font-inter">
      <Image
        src="/brand-icon.png"
        alt="OpsVantage Logo"
        width={96}
        height={96}
        className="mb-6"
        priority
      />
      <h1 className="text-4xl font-bold from-blue-500 bg-clip-text text-transparent font-orbitron mb-4">
        AI-YouTube Studio
      </h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Automated, intelligent, and beautifully engineered YouTube content creation. Built with
        precision. Powered with OpsVantage Digital.
      </p>
      <div className="flex gap-4">
        <a href="/studio" className="px-4 py-2 bg-blue-600 rounded">
          Enter Studio
        </a>
        <a
          href="https://opsvantagedigital.online"
          className="px-4 py-2 border border-white rounded"
        >
          Visit OpsVantage Digital
        </a>
      </div>
    </main>
  );
}
