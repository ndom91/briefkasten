import ImageKit from 'imagekit'
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
  const { method, headers, query, body } = req

  const protocol = headers['x-forwarded-proto'] || 'http'
  const baseUrl = req
    ? `${protocol}://${headers.host}`
    : 'http://localhost:3001'

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
        return res.status(400).json({ message: 'Missing required field: url' })
      }
      let metadata = {
        title: '',
        image: '',
        description: '',
      }

      // First fetch any additional metadata about the URL
      const resp = await fetch(url)
      metadata = await metascraper({ html: await resp.text(), url: url })

      if (!metadata.image && process.env.IMAGEKIT_PRIV_KEY) {
        // Generate image with puppeteer if we didnt get one from metadata
        const imageData = await fetch(
          `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
        )
        const imageBlob = await imageData.blob()
        const dataUrl = await asyncFileReader(imageBlob)

        const imagekit = new ImageKit({
          publicKey: process.env.IMAGEKIT_PUB_KEY,
          privateKey: process.env.IMAGEKIT_PRIV_KEY,
          urlEndpoint: process.env.IMAGEKIT_URL,
        })

        // Upload image body to ImageKit
        const imageRes = await imagekit.upload({
          file: dataUrl,
          fileName: `${new URL(url).hostname}.jpg`,
        })

        metadata.image = imageRes.url
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
                name: tag.name,
                userId,
              },
              update: {
                name: tag.name,
              },
              where: {
                id: tag.id,
                // name_userId: {
                //   name: tag,
                //   userId,
                // },
              },
            })
          })
        )

        // Finally, link the tags to bookmark in intermediate join table
        await Promise.all(
          upsertTagRes.map((tag) => {
            return prisma.tagsOnBookmarks.upsert({
              create: {
                bookmarkId: upsertBookmarkRes.id,
                tagId: tag.id,
              },
              update: {
                bookmarkId: upsertBookmarkRes.id,
                tagId: tag.id,
              },
              where: {
                bookmarkId_tagId: {
                  bookmarkId: upsertBookmarkRes.id,
                  tagId: tag.id,
                },
              },
            })
          })
        )
      }

      res.setHeader('Access-Control-Allow-Origin', '*')
      return res
        .status(200)
        .json({ data: { ...upsertBookmarkRes, tags: upsertTagRes ?? [] } })
    }
    case 'GET': {
      let bookmarksResults
      const { q, limit = 10 } = query
      const { authorization: userId } = headers

      if (!userId) {
        return res.status(400).json({ message: 'Missing required field(s)' })
      }

      try {
        bookmarksResults = await prisma.bookmark.findMany({
          take: parseInt(limit),
          distinct: ['url'],
          where: {
            AND: {
              userId,
            },
            OR: [
              {
                desc: {
                  search: `*${q}*`,
                },
              },
              {
                url: {
                  search: `*${q}*`,
                },
              },
              {
                title: {
                  search: `*${q}*`,
                },
              },
            ],
          },
        })
      } catch (error) {
        console.error('ERR', error)
        return res.status(500).json({ message: error })
      }

      res.setHeader('Access-Control-Allow-Origin', '*')
      return res.status(200).json({ results: bookmarksResults })
    }
    case 'DELETE': {
      if (session) {
        const imagekit = new ImageKit({
          publicKey: process.env.IMAGEKIT_PUB_KEY,
          privateKey: process.env.IMAGEKIT_PRIV_KEY,
          urlEndpoint: process.env.IMAGEKIT_URL,
        })
        // Delete image from ImageKit
        const { id, userId, tags = [], imageFileName } = body
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

          const imageSearchRes = await imagekit.listFiles({
            searchQuery: `name="${imageFileName}"`,
          })
          if (imageSearchRes[0].fileId) {
            await imagekit.deleteFile(imageSearchRes[0].fileId)
          }
        } catch (error) {
          console.error('ERR', error)
          return res.status(500).json({ message: error })
        }
        return res.status(200).json({ message: 'Deleted' })
      } else {
        console.error('ERR - Unauthorized attempt at /api/bookmarks')
        return res.status(403).end('Unauthorized')
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'DELETE', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
