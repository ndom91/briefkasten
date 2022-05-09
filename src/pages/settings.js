import { getServerSession } from 'next-auth/next'
import Head from 'next/head'
import Layout from '@/components/layout'
import { authOptions } from './api/auth/[...nextauth]'

export default function Settings({ session }) {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | Settings</title>
      </Head>
      <aside className="">Sidebar</aside>
      <div className="flex flex-col space-y-4">
        <h2>Settings</h2>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
