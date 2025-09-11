/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true, // optional if you plan to use server actions
  },
};

module.exports = nextConfig;