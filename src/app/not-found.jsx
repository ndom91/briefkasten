import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/layout'

export default function FourOhFour() {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | 404</title>
      </Head>
      <section className="col-span-2 mx-auto flex max-w-8xl flex-grow flex-col items-center space-y-20 px-4 py-24">
        <div className="mx-auto grid w-full grid-cols-1 items-center gap-10 md:w-4/5 lg:grid-cols-2 xl:gap-32">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Error 404
            </p>
            <h1 className="mb-4 text-left text-2xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-4xl">
              Oops! The page you&apos;re looking for isn&apos;t here.
            </h1>
            <p className="mb-5 text-left text-base text-gray-800 md:text-xl">
              You might have the wrong address, or the page may have moved.
              Please use the buttons below to go back to the homepage, or
              contact us for support.
            </p>
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
