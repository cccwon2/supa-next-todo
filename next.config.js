/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REDIRECT_URL: process.env.NEXT_PUBLIC_REDIRECT_URL,
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
