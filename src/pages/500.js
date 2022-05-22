import Image from 'next/image'
import Head from 'next/head'
import Layout from '@/components/layout'
import Sidebar from '@/components/sidebar'

export default function Settings() {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | 500</title>
      </Head>
      <section className="col-span-2 flex max-w-8xl flex-col items-center space-y-20 px-4 py-24">
        <Image
          src="/images/confused-travolta.gif"
          width="480"
          height="204"
          alt="John Travolta confused"
          className="h-64 w-full rounded-lg object-cover"
        />
        <div className="mx-auto w-full text-center lg:w-2/3">
          <h1 className="mb-4 text-6xl font-thin text-gray-900">500</h1>
          <p className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
            Oh no! There seems to be an issue on our side.
          </p>
          <p className="mb-3 text-lg font-medium text-gray-700">
            Have questions? Head over to our{' '}
            <a
              href="https://github.com/ndom91/briefkasten"
              className="underline"
            >
              product documentation
            </a>{' '}
            or visit our{' '}
            <a
              href="https://github.com/ndom91/briefkasten/issues"
              className="underline"
            >
              repository
            </a>{' '}
            and post an issue!
          </p>
        </div>
      </section>
    </Layout>
  )
}
