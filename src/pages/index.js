import Head from 'next/head'
import BookmarkCard from '@/components/bookmark-card'
import Layout from '@/components/layout'
import prisma from '@/lib/prisma'

export default function Home({ bookmarks }) {
  return (
    <Layout>
      <h1 className="mb-4 text-center text-6xl font-bold">Bookmark Manager</h1>
      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2  md:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard bookmark={bookmark} key={bookmark.id} />
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps(_context) {
  const bookmarks = await prisma.bookmark.findMany({
    include: {
      category: true,
    },
  })

  return {
    props: { bookmarks },
  }
}
