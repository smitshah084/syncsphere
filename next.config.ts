import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.externals.push({
          "utf-8-validate": "commonjs utf-8-validate",
          bufferutil: "commonjs bufferutil",
        });
        return config;
      },
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
