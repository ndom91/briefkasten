import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '@/components/layout'

export default function Settings() {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | 404</title>
      </Head>
      <section className="col-span-2 flex max-w-8xl flex-col items-center space-y-20 px-4 py-24 mx-auto flex-grow">
        <div className="grid items-center w-full grid-cols-1 gap-10 mx-auto md:w-4/5 lg:grid-cols-2 xl:gap-32">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Error 404
            </p>
            <h1 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-left text-gray-900 md:text-4xl">
              Oops! The page you&apos;re looking for isn&apos;t here.
            </h1>
            <p className="mb-5 text-base text-left text-gray-800 md:text-xl">
              You might have the wrong address, or the page may have moved.
            </p>
            <div className="flex">
              <Link href="/">
                <a className="px-5 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out bg-slate-800 lg:px-10 rounded-xl hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 hover:drop-shadow-lg mr-4">
                  Back to homepage
                </a>
              </Link>
              <a
                href="mailto:support-briefkasten@ndo.dev"
                className="px-5 py-4 text-base font-medium text-center text-slate-800 transition duration-500 ease-in-out border-2 border-slate-800 lg:px-10 rounded-xl hover:border-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800"
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
