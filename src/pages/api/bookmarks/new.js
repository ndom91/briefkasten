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

      console.log('METADATA', metadata)
      // if (!image)
      if (true) {
        console.log(
          'IMAGE FETCH URL',
          `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
        )

        const imageData = await fetch(
          `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
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
    console.error('ERR', error.syscall)
    console.error('ERR', error.address)
    console.error('ERR', error.stack)
    console.error('ERR', error.info)
    console.error('ERR', error.code)
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(500).json({ message: error })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.status(200).json({ message: 'Added' })
}
