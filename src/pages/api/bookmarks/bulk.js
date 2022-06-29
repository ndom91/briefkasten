import prisma from '@/lib/prisma'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, body } = req
  // const { method, headers, body } = req

  // const protocol = headers['x-forwarded-proto'] || 'http'
  // const baseUrl = req
  //   ? `${protocol}://${headers.host}`
  //   : 'http://localhost:3001'

  if (session) {
    switch (method) {
      case 'POST': {
        // Begin inserting into db
        // First, bookmark since we need its ID for later inserts
        const upsertBookmarkRes = await prisma.bookmark.createMany({
          data: body,
        })

        return res.status(200).json({ data: upsertBookmarkRes })
      }
      case 'GET': {
        return res.status(200).json({ results: ['Hello', 'World'] })
      }
      default: {
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } else {
    console.error('ERR - Unauthorized attempt at /api/bookmarks/bulk')
    return res.status(403).end('Unauthorized')
  }
}
