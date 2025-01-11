import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: '9j56yz4me3.ufs.sh',
      }
    ]
  },
  experimental: {
    optimizeCss: true,
    // This helps prevent style-related hydration issues
    scrollRestoration: true
  }
};

export default nextConfig;
