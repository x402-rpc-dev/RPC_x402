/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15 uses App Router by default, no need for experimental.appDir
  typescript: {
    // Disable TypeScript checking during build (for POC)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build (for POC)
    ignoreDuringBuilds: true,
  },
  // Configuration for x402
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, X-Payment',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
