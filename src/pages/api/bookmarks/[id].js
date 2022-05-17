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

    const data = { ...JSON.parse(body) }

    console.log('data', Object.keys(data))

    switch (method) {
      case 'PUT':
        try {
          await prisma.bookmark.update({
            where: { id },
            data,
          })
        } catch (error) {
          console.error('ERR', error)
          return res.status(500).json({ message: error })
        }
        break
      default:
        res.setHeader('Allow', ['PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }

    return res.status(200).json({ message: `Updated ${id}` })
  } else {
    console.error('ERR - Unauthorized attempt at /api/bookmarks/[id].js')
    return res.status(403).end('Unauthorized')
  }
}
