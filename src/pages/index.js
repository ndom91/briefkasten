import { getServerSession } from 'next-auth/next'
import BookmarkCard from '@/components/bookmark-card'
import Layout from '@/components/layout'
import { authOptions } from './api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default function Home({ sesh, bookmarks }) {
  return (
    <Layout>
      <aside className="">Nav</aside>
      <section className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2  md:grid-cols-3">
        {sesh &&
          bookmarks.map((bookmark) => (
            <BookmarkCard bookmark={bookmark} key={bookmark.id} />
          ))}
      </section>
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

  const data = await prisma.bookmark.findMany({
    where: {
      user_id: session.user.userId,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })

  // Convert 'createdAt' to string to pass through as json
  const bookmarks = data.map((boomark) => ({
    ...boomark,
    createdAt: boomark.createdAt.toString(),
    tags: boomark.tags.map((tag) => tag.tag),
  }))

  return {
    props: { sesh: session, bookmarks },
  }
}
