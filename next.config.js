/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily removing static export to allow Firebase to handle SSR properly
  // output: 'export', // Commenting out static export for now
  trailingSlash: true,
};

module.exports = nextConfig;