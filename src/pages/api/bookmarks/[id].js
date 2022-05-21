import prisma from '@/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    const {
      query: { id },
      method,
      body,
    } = req

    switch (method) {
      case 'PUT':
        try {
          await prisma.bookmark.update({
            where: { id },
            data: body,
          })
        } catch (error) {
          console.error('ERR', error)
          return res.status(500).json({ message: error })
        }
        return res.status(200).json({ message: `Updated ${id}` })
      default:
        res.setHeader('Allow', ['PUT'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    console.error('ERR - Unauthorized attempt at /api/bookmarks/[id]')
    return res.status(403).end('Unauthorized')
  }
}
