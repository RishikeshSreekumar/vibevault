/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enables Next.js to produce a minimal standalone server output
  reactStrictMode: true, // Standard Next.js recommendation
  // Any other Next.js configurations can go here
  // For example, if you need to proxy API requests in development:
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:8000/:path*', // Proxy to Backend
  //     },
  //   ]
  // },
};

export default nextConfig;
