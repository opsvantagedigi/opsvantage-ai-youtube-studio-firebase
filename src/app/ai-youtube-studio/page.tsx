'use client';

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useAuth } from '../../context/AuthContext'; // CORRECTED PATH
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase'; // CORRECTED PATH

// This component now uses the central context, making it reliable.
const AuthNav = () => {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  if (loading) {
    return <div className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse"></div>; // A loading skeleton
  }

  if (user) {
    return (
      <Link href="/ai-youtube-studio/dashboard" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        Dashboard
      </Link>
    );
  }

  return (
    <button onClick={handleSignIn} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      Login
    </button>
  );
};

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <header className="glass-header absolute top-0 left-0 w-full flex items-center justify-between p-6">
        <div className="flex items-center">
          <Logo />
          <h1 className="text-2xl font-bold ml-3 font-display">OpsVantage AI-YouTube Studio</h1>
        </div>
        <nav>
          <AuthNav />
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
            <Link href="/ai-youtube-studio/wizard" className="inline-block px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out">
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
