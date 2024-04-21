const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATA_URL: 'https://api.mccreations.net',
    LOGGING_URL: 'https://api.mccreations.net/bamboo/v1'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: "mccreations.s3.us-west-1.amazonaws.com"
      },
      {
        protocol: 'https',
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: 'https',
        hostname: "avatars.githubusercontent.com"
      },
      {
        protocol: 'https',
        hostname: "cdn.discordapp.com"
      },
      {
        protocol: 'https',
        hostname: 'www.minecraftmaps.com'
      }
    ],
  }
}

module.exports = withMDX(nextConfig)