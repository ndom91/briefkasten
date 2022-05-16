import prisma from '@/lib/prisma'
const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
])

export default async function handler(req, res) {
  const { userId, title, url, desc, image } = JSON.parse(req.body)
  if (!url) {
    return res.status(400).json({ message: 'Missing required field: url' })
  }

  try {
    let metadata = {
      title: '',
      image: '',
      description: '',
    }

    if (!title || !desc || !image) {
      const resp = await fetch(url)
      metadata = await metascraper({ html: await resp.text(), url: url })

      // if (!image) {
      if (true) {
        const imageData = await fetch(
          new URL(`/api/bookmarks/image?url=${url}`)
        )
        console.log('data', imageData)
        const imageRaw = await imageData.text()
        console.log('raw', imageData)
        metadata.image = imageRaw
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        bookmarks: {
          upsert: {
            create: {
              url,
              title: title ?? metadata.title,
              image: image ?? metadata.image,
              desc: desc ?? metadata.description,
            },
            update: {
              url,
              title: title ?? metadata.title,
              image: image ?? metadata.image,
              desc: desc ?? metadata.description,
            },
            where: { url_userId: { url: url, userId: userId } },
          },
        },
      },
    })
  } catch (error) {
    console.error('ERR', error)
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(500).json({ message: error })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({ message: 'Added' })
}
