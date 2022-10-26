import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import ClientPage from './clientPage'

export default async function Home() {
  const { session, initialZustandState, data } = await getData()

  return (
    <ClientPage
      initialZustandState={initialZustandState}
      session={session}
      data={data}
    />
  )
}

export async function getData() {
  const nextCookies = cookies()
  const sessionCookie = `next-auth.csrf-token=${nextCookies.get(
    'next-auth.csrf-token'
  )}; next-auth.callback-url=${nextCookies.get(
    'next-auth.callback-url'
  )}; next-auth.session-token=${nextCookies.get('next-auth.session-token')}`
  // console.log('sC', sessionCookie)
  const session = await fetch('http://localhost:3001/api/auth/session', {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      host: 'localhost:3001',
      Cookie: sessionCookie,
    },
  }).then((r) => r.json())

  if (!session.user) {
    return { nextauth: 'Could not fetch user' }
  }

  // const zustandStore = initializeStore()

  const bookmarkData = await prisma.bookmark.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      userId: session.user.userId,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.userId,
    },
    include: {
      _count: {
        select: { bookmarks: true },
      },
    },
  })
  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.userId,
    },
    orderBy: [{ name: 'asc' }],
    include: {
      _count: {
        select: { bookmarks: true },
      },
    },
  })

  // Convert 'createdAt' to string to pass through as json
  const bookmarks = bookmarkData.map((bookmark) => ({
    ...bookmark,
    createdAt: bookmark.createdAt.toString(),
    tags: bookmark.tags.map((tag) => tag.tag),
  }))

  // zustandStore.getState().setBookmarks(bookmarks)
  // zustandStore.getState().setCategories(categories)
  // zustandStore.getState().setTags(tags)

  return {
    session,
    // initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    data: JSON.parse(JSON.stringify({ bookmarks, categories, tags })),
  }
}
