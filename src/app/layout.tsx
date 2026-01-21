
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ["latin"], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: "OpsVantage AI-YouTube Studio",
  description: "The autonomous, emotionally intelligent, enterprise-grade AI system that creates YouTube videos for you.",
  icons: {
    icon: '/opsvantage-logo.png',
    apple: '/opsvantage-logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} font-sans`} suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
