import { getServerSession } from 'next-auth/next'
import Head from 'next/head'
import Layout from '@/components/layout'
import { authOptions } from './api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default function Categories({ session, categories }) {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | Categories</title>
      </Head>
      <aside className="">Sidebar</aside>
      <section>
        <ul>
          {categories &&
            categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
        </ul>
      </section>
      <div className="flex flex-col space-y-4"></div>
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

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.userId,
    },
  })

  return {
    props: { session, categories },
  }
}
