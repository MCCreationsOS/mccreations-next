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
      },
      {
        protocol: 'https',
        hostname: 'static.planetminecraft.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.modrinth.com'
      },
      {
        protocol: 'https',
        hostname: 'next.mccreations.net'
      },
      {
        protocol: 'https',
        hostname: 'mccreations.net'
      },
      {
        protocol: 'https',
        hostname: 'mccreations-s3.s3.us-east-va.io.cloud.ovh.us'
      }
    ],
  },
  reactStrictMode: false
}

module.exports = withMDX(nextConfig)

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "mccreations",
    project: "mccreations-next",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
