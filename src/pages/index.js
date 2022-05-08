import { getServerSession } from 'next-auth/next'
import BookmarkCard from '@/components/bookmark-card'
import Layout from '@/components/layout'
import { authOptions } from './api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default function Home({ session, bookmarks }) {
  console.log('client sess', session, bookmarks)
  // const { session, bookmarks } = props
  // console.log('sess', session)
  return (
    <Layout>
      <aside className="">Nav</aside>
      <section className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2  md:grid-cols-3">
        {session &&
          bookmarks.map((bookmark) => (
            <BookmarkCard bookmark={bookmark} key={bookmark.id} />
          ))}
      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions)
  console.log('server sess', session)

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   }
  // }

  const bookmarks = await prisma.bookmark.findMany({
    include: {
      category: true,
    },
  })

  console.log('server bookmarks', bookmarks)

  return {
    props: { session, bookmarks },
  }
}
