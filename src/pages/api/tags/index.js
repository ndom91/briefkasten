import prisma from '@/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  const { method, body } = req

  if (session) {
    switch (method) {
      case 'POST': {
        const { userId, name, emoji } = body
        if (!name) {
          return res.status(400).json({ message: 'Missing required field(s)' })
        }

        const createResult = await prisma.tag.create({
          data: {
            name,
            emoji,
            userId,
          },
        })

        return res.status(200).json({ data: createResult })
      }
      case 'GET': {
        return res.status(200).json({ results: ['Hello', 'World'] })
      }
      case 'DELETE': {
        const { id, userId } = body

        if (!id || !userId) {
          return res.status(400).json({ message: 'Missing required field(s)' })
        }
        try {
          await prisma.tag.delete({
            where: { id },
          })
          await prisma.tagsOnBookmarks.deleteMany({
            where: { tagId: id },
          })
        } catch (error) {
          console.error('ERR', error)
          return res.status(500).json({ message: error })
        }
        return res.status(200).json({ message: 'Deleted' })
      }
      default: {
        res.setHeader('Allow', ['GET', 'DELETE', 'POST'])
        return res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } else {
    console.error('ERR - Unauthorized attempt at /api/tags')
    return res.status(403).end('Unauthorized')
  }
}
