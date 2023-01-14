import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/layout'
import * as Sentry from '@sentry/nextjs'
import NextErrorComponent from 'next/error'

export default function Error({ statusCode, hasGetInitialPropsRun, err }) {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err)
    // Flushing is not required in this case as it only happens on the client
  }

  return (
    <Layout>
      <Head>
        <title>Briefkasten | Error</title>
      </Head>
      <section className="col-span-2 mx-auto flex max-w-8xl flex-grow flex-col items-center space-y-20 px-4 py-24">
        <div className="mx-auto grid w-full grid-cols-1 items-center gap-10 md:w-4/5 lg:grid-cols-2 xl:gap-32">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Error {statusCode}
            </p>
            <h1 className="mb-4 text-left text-2xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-4xl">
              Oops! That wasn&apos;t supposed to happen.
            </h1>
            <p className="mb-5 text-left text-base text-gray-800 md:text-xl">
              You might have the wrong address, or the page may have moved.
              Please use the buttons below to go back to the homepage, or
              contact us for support.
            </p>
            <NextErrorComponent statusCode={statusCode} />
            <div className="flex">
              <Link href="/" legacyBehavior>
                <a className="mr-4 rounded-lg bg-slate-800 px-5 py-2 text-center text-base font-medium text-white transition duration-500 ease-in-out hover:bg-slate-900 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 lg:px-10">
                  Back to homepage
                </a>
              </Link>
              <a
                href="mailto:support-briefkasten@ndo.dev"
                className="rounded-lg border-2 border-slate-800 px-5 py-2 text-center text-base font-medium text-slate-800 transition duration-500 ease-in-out hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 lg:px-10"
              >
                Contact us
              </a>
            </div>
          </div>
          <div>
            <Image
              src="/images/confused-travolta.gif"
              width="480"
              height="204"
              alt="John Travolta confused"
              className="h-64 w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}

Error.getInitialProps = async (contextData) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(
    contextData
  )

  const { res, err, asPath } = contextData
  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true

  // Returning early because we don't want to log 404 errors to Sentry.
  if (res?.statusCode === 404) {
    return errorInitialProps
  }

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    Sentry.captureException(err)

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000)

    return errorInitialProps
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  )
  await Sentry.flush(2000)

  return errorInitialProps
  /* await Sentry.captureUnderscoreErrorException(contextData) */
  /**/
  /* return { statusCode } */
}
