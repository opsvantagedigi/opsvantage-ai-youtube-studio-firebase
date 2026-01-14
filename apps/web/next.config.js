/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // Keep legacy/top-level turbopack key for compatibility
  turbopack: {
    root: __dirname,
  },
  // Also set under experimental key which Turbopack in some Next versions reads
  experimental: {
    turbopack: {
      root: path.resolve(__dirname),
    },
  },
}

module.exports = nextConfig
