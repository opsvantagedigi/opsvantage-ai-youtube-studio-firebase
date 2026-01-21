'use client';

import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase'; // Make sure this path is correct

// A small component for the Login button
const SignInButton = () => {
  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <button onClick={handleSignIn} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      Login
    </button>
  );
};

// A small component for the Dashboard button
const DashboardButton = () => {
  return (
    <Link href="/dashboard" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
      Dashboard
    </Link>
  );
};


export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans">
      <header className="glass-header absolute top-0 left-0 w-full flex items-center justify-between p-6">
        <div className="flex items-center">
          <Logo />
          <h1 className="text-2xl font-bold ml-3 font-display">OpsVantage AI-YouTube Studio</h1>
        </div>
        <nav>
          {loading ? <div></div> : (user ? <DashboardButton /> : <SignInButton />)}
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
            <Link href="/wizard" className="inline-block px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-lg hover:scale-105 transform transition-transform duration-300 ease-in-out">
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
