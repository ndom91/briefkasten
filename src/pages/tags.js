import { getServerSession } from 'next-auth/next'
import Head from 'next/head'
import Layout from '@/components/layout'
import { authOptions } from './api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default function Tags({ session, tags }) {
  return (
    <Layout>
      <Head>
        <title>Briefkasten | Tags</title>
      </Head>
      <aside className="">Sidebar</aside>
      <div className="flex flex-col space-y-4">
        <section>
          <ul>
            {tags &&
              tags.map((tag) => (
                <li key={tag.id}>
                  <span className="mr-2">{tag.name}</span>
                  <svg
                    className={`inline h-6 w-6`}
                    fill="none"
                    stroke={tag.color ?? '#333'}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </li>
              ))}
          </ul>
        </section>
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

  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.userId,
    },
  })

  return {
    props: { session, tags },
  }
}
