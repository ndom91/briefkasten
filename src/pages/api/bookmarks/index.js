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
        const {
          userId,
          url,
          title = '',
          category = '',
          desc = '',
          tags = [],
        } = body
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

        // First fetch any additional metadata about the URL
        const resp = await fetch(url)
        metadata = await metascraper({ html: await resp.text(), url: url })

        if (!metadata.image) {
          // Generate image with puppeteer if we didnt get one from metadata
          const imageData = await fetch(
            `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
          )
          const imageBlob = await imageData.blob()
          const dataUrl = await asyncFileReader(imageBlob)

          // Upload Base64 image to ImageKit
          const uploadRes = await fetch(
            `${baseUrl}/api/bookmarks/uploadImage?fileName=${
              new URL(url).hostname
            }`,
            {
              method: 'PUT',
              body: dataUrl,
            }
          )
          const uploadData = await uploadRes.json()
          // Set image url
          metadata.image = uploadData.url
        }

        // Begin inserting into db
        // First, bookmark since we need its ID for later inserts
        let upsertTagRes
        const upsertBookmarkRes = await prisma.bookmark.upsert({
          include: {
            category: true,
          },
          create: {
            url,
            title: title.length ? title : metadata.title,
            image: metadata.image,
            desc: desc.length ? desc : metadata.description,
            user: {
              connect: {
                id: userId,
              },
            },
            category: category
              ? {
                  connect: {
                    name_userId: {
                      name: category,
                      userId,
                    },
                  },
                }
              : {},
          },
          update: {
            url,
            title: title.length ? title : metadata.title,
            image: metadata.image,
            desc: desc.length ? desc : metadata.description,
            category: category
              ? {
                  connect: {
                    name_userId: {
                      name: category,
                      userId,
                    },
                  },
                }
              : {},
          },
          where: { url_userId: { url: url, userId: userId } },
        })

        // Next, if there are tags, insert them sequentially
        if (tags && tags.filter(Boolean).length > 0) {
          upsertTagRes = await Promise.all(
            tags.map(async (tag) => {
              return await prisma.tag.upsert({
                create: {
                  name: tag,
                  userId,
                },
                update: {
                  name: tag,
                },
                where: {
                  name_userId: {
                    name: tag,
                    userId,
                  },
                },
              })
            })
          )

          // Finally, link the tags to bookmark in intermediate join table
          await prisma.tagsOnBookmarks.createMany({
            data: upsertTagRes.map((tag) => ({
              bookmarkId: upsertBookmarkRes.id,
              tagId: tag.id,
            })),
          })
        }

        res.setHeader('Access-Control-Allow-Origin', '*')
        return res
          .status(200)
          .json({ data: { ...upsertBookmarkRes, tags: upsertTagRes ?? [] } })
      }
      case 'GET': {
        return res.status(200).json({ results: ['Hello', 'World'] })
      }
      case 'DELETE': {
        const { id, userId, tags = [] } = body

        if (!id || !userId) {
          return res.status(400).json({ message: 'Missing required field(s)' })
        }
        try {
          if (tags.length > 0) {
            await Promise.all(
              tags.map(
                async (tag) =>
                  await prisma.tagsOnBookmarks.delete({
                    where: { bookmarkId_tagId: { bookmarkId: id, tagId: tag } },
                  })
              )
            )
          }
          await prisma.bookmark.delete({
            where: { id },
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
