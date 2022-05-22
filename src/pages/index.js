import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/api/auth/[...nextauth]'
import { useStore, initializeStore } from '@/lib/store'

import BookmarkCard from '@/components/bookmark-card'
import Layout from '@/components/layout'
import QuickAdd from '@/components/quick-add'
import Sidebar from '@/components/sidebar'
import prisma from '@/lib/prisma'

export default function Home() {
  const bookmarks = useStore((state) => state.bookmarks)
  const categories = useStore((state) => state.categories)
  const categoryFilter = useStore((state) => state.categoryFilter)
  const tagFilter = useStore((state) => state.tagFilter)
  const searchText = useStore((state) => state.searchText)

  return (
    <Layout>
      <Sidebar />
      <div className="flex flex-col space-y-2 pr-4">
        <QuickAdd categories={categories} />
        <section className="grid grid-cols-1 justify-items-stretch gap-4 pt-4 sm:grid-cols-3 md:grid-cols-4">
          {bookmarks
            .reduce((bookmarks, thisBookmark) => {
              if (categoryFilter || tagFilter) {
                // Filter shown bookmarks selected sidebar filters
                if (thisBookmark.categoryId === categoryFilter) {
                  bookmarks.push(thisBookmark)
                } else if (
                  thisBookmark.tags.some((tag) => tag.id === tagFilter)
                ) {
                  bookmarks.push(thisBookmark)
                }
              } else if (searchText) {
                // Filter shown bookmarks on search
                if (
                  thisBookmark.url.includes(searchText) ||
                  thisBookmark.title.includes(searchText)
                ) {
                  bookmarks.push(thisBookmark)
                }
              } else {
                bookmarks.push(thisBookmark)
              }
              return bookmarks
            }, [])
            .map((bookmark) => (
              <BookmarkCard
                suppressHydrationWarning={true}
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
  const zustandStore = initializeStore()

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

  const categories = await prisma.category.findMany({
    where: {
      userId: nextauth.user.userId,
    },
  })
  const tags = await prisma.tag.findMany({
    where: {
      userId: nextauth.user.userId,
    },
  })

  // Convert 'createdAt' to string to pass through as json
  const bookmarks = bookmarkData.map((boomark) => ({
    ...boomark,
    createdAt: boomark.createdAt.toString(),
    tags: boomark.tags.map((tag) => tag.tag),
  }))

  zustandStore.getState().setBookmarks(bookmarks)
  zustandStore.getState().setCategories(categories)
  zustandStore.getState().setTags(tags)

  return {
    props: {
      nextauth,
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  }
}
