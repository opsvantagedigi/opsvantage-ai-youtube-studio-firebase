import './globals.css'
import { Orbitron, Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { AuthProvider } from '@/components/AuthProvider'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'AI-YouTube Studio | OpsVantage Digital',
  description: 'Next-gen AI video orchestration.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <div className="ambient-bg" />
        <div id="cursor-glow" className="cursor-glow" />
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  )
}
