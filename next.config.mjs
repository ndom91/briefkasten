import { withSentryConfig } from '@sentry/nextjs'

const sentryWebpackPluginOptions = {
  silent: process.env.NODE_ENV === 'production' ? true : false, // Suppresses all logs
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
  sentry: {
    hideSourceMaps: false,
    widenClientFileUpload: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'avatars.githubusercontent.com',
      'source.boringavatars.com',
      'exjtybpqdtxkznbmllfi.supabase.co',
      'cdn.statically.io',
      'ik.imagekit.io',
    ],
  },
}

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)
