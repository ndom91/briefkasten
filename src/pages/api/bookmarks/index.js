import prisma from '@/lib/prisma'
import { getSession } from 'next-auth/react'
import { asyncFileReader } from '@/lib/helpers'

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
])

export default async function handler(req, res) {
  const session = await getSession({ req })
  const { method, headers, body } = req

  const protocol = headers['x-forwarded-proto'] || 'http'
  const baseUrl = req
    ? `${protocol}://${headers.host}`
    : 'http://localhost:3001'

  if (session) {
    switch (method) {
      case 'POST': {
        const { userId, title, url, desc } = body
        if (!url) {
          return res
            .status(400)
            .json({ message: 'Missing required field: url' })
        }
        let metadata = {
          title: '',
          image: '',
          description: '',
        }

        const resp = await fetch(url)
        metadata = await metascraper({ html: await resp.text(), url: url })

        if (!metadata.image) {
          // Generate image with puppeteer
          const imageData = await fetch(
            `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
          )
          const imageBlob = await imageData.blob()
          const dataUrl = await asyncFileReader(imageBlob)

          // Upload Base64 image to ImageKit
          const uploadRes = await fetch(
            `${baseUrl}/api/bookmarks/uploadImage?fileName=${
              new URL(url).hostname
            }&id=${id}`,
            {
              method: 'PUT',
              body: dataUrl,
            }
          )
          const uploadData = await uploadRes.json()
          // Set image url
          metadata.image = uploadData.url
        }

        const upsertResult = await prisma.bookmark.upsert({
          create: {
            url,
            title: title.length ? title : metadata.title,
            image: metadata.image,
            desc: desc.length ? desc : metadata.description,
            userId,
          },
          update: {
            url,
            title: title.length ? title : metadata.title,
            image: metadata.image,
            desc: desc.length ? desc : metadata.description,
          },
          where: { url_userId: { url: url, userId: userId } },
        })

        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).json({ data: upsertResult })
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
          await prisma.bookmark.delete({
            where: { id },
          })
          await prisma.tagsOnBookmarks.delete({
            where: { bookmarkId_tagId: { bookmarkId: id, tagId: '123' } },
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
    console.error('ERR - Unauthorized attempt at /api/bookmarks')
    return res.status(403).end('Unauthorized')
  }
}
