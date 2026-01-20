/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/queue'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
