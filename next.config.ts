import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  experimental: {
    authInterrupts: true, // Enable experimental auth interrupts
  },
  typescript: {
    ignoreBuildErrors: true, // Disables ALL TypeScript errors during build
  },
};

export default nextConfig;
