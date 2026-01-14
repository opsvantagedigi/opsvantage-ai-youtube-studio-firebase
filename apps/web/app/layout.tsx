import type { Metadata } from 'next';
import './globals.css';
import { orbitron, inter } from './fonts';

export const metadata: Metadata = {
  title: 'AI-YouTube Studio',
  description: 'OpsVantage Digital — AI YouTube Studio',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/brand-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a0f1c" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
