import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  const { id } = JSON.parse(req.body)

  if (req.method === 'DELETE') {
    try {
      await prisma.bookmark.delete({
        where: { id },
      })
    } catch (error) {
      console.error('ERR', error)
      res.setHeader('Access-Control-Allow-Origin', '*')
      return res.status(500).json({ message: error })
    }
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({ message: 'Deleted' })
}
