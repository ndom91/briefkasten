// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://2b0f5bb15ddd4feeb9fbed676243f0b6@o1287700.ingest.sentry.io/6503207',
  tracesSampleRate: 0.5,
  allowUrls: ['localhost:3001', 'briefkastenhq.com'],
})
