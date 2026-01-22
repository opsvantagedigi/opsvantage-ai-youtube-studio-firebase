
import React from 'react';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900">
        <header className="bg-opacity-20 backdrop-blur-lg rounded-xl border border-gray-700 text-white p-4 m-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold font-orbitron gradient-text">OpsVantage AI</h1>
            <nav>
              <a href="/" className="px-4">Home</a>
              <a href="/app" className="px-4">App</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-opacity-20 backdrop-blur-lg rounded-xl border border-gray-700 text-white p-4 m-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 OpsVantage AI. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
