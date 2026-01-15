/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = {
  turbopack: {
    // Ensure Turbopack resolves the correct workspace root on CI
    root: path.resolve(__dirname),
  },
  // Keep outputFileTracingRoot in sync with turbopack.root
  outputFileTracingRoot: path.resolve(__dirname),
}
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Turbopack where the workspace root lives relative to this app
  turbopack: {
    root: '../../',
  },
}

module.exports = nextConfig
