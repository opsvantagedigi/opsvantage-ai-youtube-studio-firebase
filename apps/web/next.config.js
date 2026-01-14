/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Force Turbopack to treat /apps/web as the project root
    root: __dirname,
  },
};

module.exports = nextConfig;
