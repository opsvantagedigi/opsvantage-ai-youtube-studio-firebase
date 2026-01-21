
import { Logo } from "@/components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <header className="glass-header absolute top-0 left-0 w-full flex items-center justify-between p-6">
        <div className="flex items-center">
          <Logo />
          <h1 className="text-2xl font-bold ml-3 font-display">OpsVantage AI-YouTube Studio</h1>
        </div>
        <nav>
          <Link href="/dashboard" className="text-lg font-medium hover:text-gray-400 transition-colors">
            Dashboard
          </Link>
        </nav>
      </header>

      <main className="text-center">
        <div className="glass-box">
            <h2 className="text-6xl font-bold mb-4 font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
              Create YouTube videos with the power of AI
            </h2>
            <p className="text-xl mb-8">
              The autonomous, emotionally intelligent, enterprise-grade AI system that creates YouTube videos for you.
            </p>
            <Link href="/wizard" className="cta-button cta-glow">
                Get Started
            </Link>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full text-center p-6 text-sm text-gray-500">
        &copy; 2024 OpsVantage AI-YouTube Studio. All rights reserved.
      </footer>
    </div>
  );
}
