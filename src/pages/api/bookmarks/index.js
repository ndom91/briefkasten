import prisma from '@/lib/prisma'
import { getPlaiceholder } from 'plaiceholder'
import { supabase } from '@/lib/supabaseClient'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { asyncFileReader, prepareBase64DataUrl } from '@/lib/helpers'

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
])

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, headers, query, body } = req

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

      if (!metadata.image) {
        // Generate image with puppeteer if we didnt get one from metadata
        const imageData = await fetch(
          `https://briefkasten-screenshot.vercel.app/api/image?url=${encodeURIComponent(
            url
          )}`
        )
        const imageBlob = await imageData.blob()
        const dataUrl = await asyncFileReader(imageBlob)

        let { data, error } = await supabase.storage
          .from('bookmark-imgs')
          .upload(
            `${session.user?.userId}/${new URL(url).hostname}.jpg`,
            Buffer.from(prepareBase64DataUrl(dataUrl), 'base64'),
            {
              contentType: 'image/jpeg',
              upsert: true,
            }
          )

        if (error) {
          throw error
        }

        const { base64 } = await getPlaiceholder(
          `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`
        )

        metadata.image = `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`
        metadata.imageBlur = base64
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
          imageBlur: metadata.imageBlur,
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
          imageBlur: metadata.imageBlur,
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
      const { q, limit = 10 } = query
      const { authorization: userId } = headers

      if (!userId) {
        return res.status(400).json({ message: 'Missing required field(s)' })
      }

      try {
        const bookmarksResults = await prisma.bookmark.findMany({
          take: parseInt(limit),
          distinct: ['url'],
          where: {
            AND: {
              userId,
            },
            OR: [
              {
                desc: {
                  search: q,
                },
              },
              {
                url: {
                  search: q,
                },
              },
              {
                title: {
                  search: q,
                },
              },
            ],
          },
        })
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).json({ results: bookmarksResults })
      } catch (error) {
        console.error('ERR', error)
        return res.status(500).json({ message: error })
      }
    }
    case 'DELETE': {
      if (session) {
        const { id, userId, imageFileName } = body
        if (!id || !userId) {
          return res.status(400).json({ message: 'Missing required field(s)' })
        }
        try {
          await prisma.bookmark.delete({
            where: { id },
          })

          const { error } = await supabase.storage
            .from('bookmark-imgs')
            .remove([imageFileName])

          if (error) {
            throw error
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

export default handler
