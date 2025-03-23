import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  reactStrictMode: true,
  images: {
    domains: ['api.mccreations.net', 'mccreations.net', 'mccreations.s3.us-west-1.amazonaws.com', 'static.planetminecraft.com', 'cdn.modrinth.com'],
    formats: ['image/avif', 'image/webp'],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
