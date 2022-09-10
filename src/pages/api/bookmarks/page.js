import prisma from '@/lib/prisma'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { serverTiming } from '@/lib/helpers'

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, query } = req

  if (!session?.user) {
    console.error('ERR - Unauthorized attempt to DELETE /api/bookmarks')
    return res.status(403).end('Unauthorized')
  }

  switch (method) {
    case 'GET': {
      serverTiming.start()
      /* const { q, start, end } = query */
      const { start, end } = query
      if (start - end === 0) {
        return res.status(200).json({ results: [] })
      }

      try {
        const bookmarksResults = await prisma.bookmark.findMany({
          take: parseInt(end - start),
          skip: parseInt(start),
          distinct: ['url'],
          where: {
            userId: session.user.userId,
          },
          orderBy: [
            {
              createdAt: 'desc',
            },
          ],
        })

        res.setHeader('Server-Timing', serverTiming.setHeader())
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).json({ results: bookmarksResults })
      } catch (error) {
        console.error('ERR', error)
        return res.status(500).json({ message: error })
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'DELETE', 'POST', 'PUT'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}

export default handler
