import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  console.log(req.method, req.body)
  const { user_id, title, url } = JSON.parse(req.body)

  await prisma.bookmark.upsert({
    where: {
      url,
    },
    create: {
      user_id,
      url,
      title,
    },
    update: {
      user_id,
      url,
      title,
    },
  })

  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({ message: 'Bookmark Added Successfully!' })
}
