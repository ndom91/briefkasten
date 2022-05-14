import { getServerSession } from 'next-auth/next'
import BookmarkCard from '@/components/bookmark-card'
import Layout from '@/components/layout'
import QuickAdd from '@/components/quick-add'
import { authOptions } from './api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default function Home({ sesh, bookmarks }) {
  return (
    <Layout>
      <aside className="">Sidebar</aside>
      <div className="flex flex-col space-y-2">
        <QuickAdd />
        <section className="grid grid-cols-1 justify-items-stretch gap-4 sm:grid-cols-3 md:grid-cols-4">
          {sesh &&
            bookmarks.map((bookmark) => (
              <BookmarkCard bookmark={bookmark} key={bookmark.id} />
            ))}
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

  const data = await prisma.bookmark.findMany({
    where: {
      userId: session.user.userId,
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
