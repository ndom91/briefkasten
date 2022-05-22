import Image from 'next/image'
import Head from 'next/head'
import Layout from '@/components/layout'
import Sidebar from '@/components/sidebar'

export default function Settings() {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | 404</title>
      </Head>
      <Sidebar />
      <div className="flex flex-col space-y-4">
        <div className="mt-24 text-center">
          <Image
            src="/images/confused-travolta.gif"
            width="480"
            height="204"
            alt="John Travolta confused"
            className="h-64 w-full rounded-lg object-cover"
          />

          <p className="mt-6 text-gray-500">
            We couldn&apos;t find anything there, please try again.
          </p>
        </div>
      </div>
    </Layout>
  )
}
