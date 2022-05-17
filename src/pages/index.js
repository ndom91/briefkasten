import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

import BookmarkCard from '@/components/bookmark-card'
import Layout from '@/components/layout'
import QuickAdd from '@/components/quick-add'
import Sidebar from '@/components/sidebar'
import prisma from '@/lib/prisma'

export default function Home({ bookmarks, categories, tags }) {
  return (
    <Layout>
      <Sidebar categories={categories} tags={tags} />
      <div className="flex flex-col space-y-2">
        <QuickAdd categories={categories} />
        <section className="grid grid-cols-1 justify-items-stretch gap-4 pt-4 sm:grid-cols-3 md:grid-cols-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              bookmark={bookmark}
              key={bookmark.id}
              categories={categories}
            />
          ))}
        </section>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const nextauth = await getServerSession(context, authOptions)

  if (!nextauth) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const bookmarkData = await prisma.bookmark.findMany({
    where: {
      userId: nextauth.user.userId,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })

  const categories = await prisma.category.findMany()
  const tags = await prisma.tag.findMany()

  // Convert 'createdAt' to string to pass through as json
  const bookmarks = bookmarkData.map((boomark) => ({
    ...boomark,
    createdAt: boomark.createdAt.toString(),
    tags: boomark.tags.map((tag) => tag.tag),
  }))

  return {
    props: { nextauth, bookmarks, categories, tags },
  }
}
