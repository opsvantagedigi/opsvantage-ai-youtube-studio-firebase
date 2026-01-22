
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AppPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 font-orbitron gradient-text">OpsVantage Digital AI-YouTube Studio</h1>
      <p className="text-lg mb-8">
        The Autonomous AI Agent for YouTube Content Creation, Scheduling, and Publishing
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="gradient-box rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 font-orbitron text-white">Core Features</h2>
          <ul className="list-disc list-inside text-white">
            <li>Automated Content Generation</li>
            <li>Intelligent Scheduling</li>
            <li>Seamless Publishing</li>
            <li>Audience Analytics</li>
            <li>Monetization Insights</li>
          </ul>
        </div>
        <div className="gradient-box rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 font-orbitron text-white">Architecture</h2>
          <p className="text-white">
            OpsVantage AI is built on a modern, serverless architecture, leveraging the power of Google&apos;s Generative AI and Firebase to deliver a robust and scalable platform.
          </p>
          <p className="text-white">
            The frontend is built with Next.js and Tailwind CSS, providing a responsive and user-friendly interface.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Get Started
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppPage;
