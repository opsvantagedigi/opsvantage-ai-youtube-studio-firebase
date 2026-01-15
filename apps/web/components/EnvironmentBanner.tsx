import React from 'react'

const ENV = process.env.NEXT_PUBLIC_ENVIRONMENT

export default function EnvironmentBanner() {
  if (!ENV || ENV === 'production') return null
  const color = ENV === 'staging' ? 'bg-yellow-400' : 'bg-blue-400'
  const label = ENV.charAt(0).toUpperCase() + ENV.slice(1)
  return (
    <div
      className={`w-full ${color} font-orbitron bg-opacity-80 py-2 text-center font-bold text-black shadow-lg backdrop-blur-md`}
      style={{
        background:
          ENV === 'staging'
            ? 'linear-gradient(90deg, #FDE68A 0%, #F59E42 100%)'
            : 'linear-gradient(90deg, #60A5FA 0%, #2563EB 100%)',
        fontFamily: 'Orbitron, Inter, sans-serif',
      }}
    >
      {label} Environment
    </div>
  )
}
