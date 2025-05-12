import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: '100mb',
  },
}

export default nextConfig;
