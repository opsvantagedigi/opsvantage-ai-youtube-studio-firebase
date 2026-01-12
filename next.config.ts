import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        // Apply a permissive CSP to allow necessary runtime evaluation used by
        // some third-party libs. Adjust for tighter security if desired.
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; connect-src *; font-src 'self' data: https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
