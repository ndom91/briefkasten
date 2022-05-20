import prisma from '@/lib/prisma'
const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
])

export default async function handler(req, res) {
  const { userId, title, url, desc, image } = req.body
  if (!url) {
    return res.status(400).json({ message: 'Missing required field: url' })
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const baseUrl = req
    ? `${protocol}://${req.headers.host}`
    : 'http://localhost:3001'

  try {
    let metadata = {
      title: '',
      image: '',
      description: '',
    }

    if (!title || !desc || !image) {
      const resp = await fetch(url)
      metadata = await metascraper({ html: await resp.text(), url: url })

      if (!metadata.image) {
        const imageData = await fetch(
          `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
        )
        const imageRaw = await imageData.text()
        metadata.image = imageRaw
      }
    }

    const upsertResult = await prisma.bookmark.upsert({
      create: {
        url,
        title: title ?? metadata.title,
        image: image ?? metadata.image,
        desc: desc ?? metadata.description,
        userId,
      },
      update: {
        url,
        title: title ?? metadata.title,
        image: image ?? metadata.image,
        desc: desc ?? metadata.description,
      },
      where: { url_userId: { url: url, userId: userId } },
    })

    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json({ ...upsertResult })
  } catch (error) {
    console.error('ERR', error)
    console.error('ERR', error.syscall)
    console.error('ERR', error.address)
    console.error('ERR', error.stack)
    console.error('ERR', error.info)
    console.error('ERR', error.code)
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(500).json({ message: error })
  }
}
