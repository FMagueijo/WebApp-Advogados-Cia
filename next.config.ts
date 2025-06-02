import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  experimental: {
    authInterrupts: true, // Enable experimental auth interrupts
  },
};

export default nextConfig;
