import prisma from '@/lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  const { method, body } = req

  if (session) {
    switch (method) {
      case 'POST': {
        const { userId, name, desc } = body
        if (!name) {
          return res.status(400).json({ message: 'Missing required field(s)' })
        }

        const createResult = await prisma.category.create({
          data: {
            name,
            description: desc,
            userId,
          },
        })

        return res.status(200).json({ data: createResult })
      }
      case 'PUT': {
        const { id, userId, name, description } = body
        if (!name || !id || !userId) {
          return res.status(400).json({ message: 'Missing required field(s)' })
        }

        const updateResult = await prisma.category.update({
          where: {
            id,
          },
          data: {
            name,
            description,
          },
        })

        return res.status(200).json({ data: updateResult })
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
          await prisma.category.delete({
            where: { id },
          })
        } catch (error) {
          console.error('ERR', error)
          return res.status(500).json({ message: error })
        }
        return res.status(200).json({ message: 'Deleted' })
      }
      default: {
        res.setHeader('Allow', ['GET', 'DELETE', 'POST', 'PUT'])
        return res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } else {
    console.error('ERR - Unauthorized attempt at /api/categories')
    return res.status(403).end('Unauthorized')
  }
}
