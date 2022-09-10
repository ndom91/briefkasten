import { withSentryConfig } from '@sentry/nextjs'

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
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
