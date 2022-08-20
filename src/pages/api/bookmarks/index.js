import prisma from '@/lib/prisma'
import { getPlaiceholder } from 'plaiceholder'
import { supabase } from '@/lib/supabaseClient'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { isAbsoluteUrl, setTiming } from '@/lib/helpers'

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-title')(),
])

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, headers, query, body } = req

  switch (method) {
    case 'PUT': {
      if (session) {
        const perf = {
          total: {
            start: performance.now(),
          },
        }

        const {
          userId,
          url,
          title = '',
          category = '',
          desc = '',
          tags = [],
          id,
        } = body

        if (!url || !isAbsoluteUrl(url)) {
          return res.status(400).json({ message: 'URL Missing or Invalid' })
        }

        setTiming('bookmarkUpdate', perf)
        const updateBookmarkRes = await prisma.bookmark.update({
          data: {
            url,
            title,
            desc,
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
          include: {
            category: true,
          },
          where: { id },
        })
        setTiming('bookmarkUpdate', perf)

        // Next, if there are tags, insert them sequentially
        let updateTagRes
        if (tags && tags.filter(Boolean).length) {
          setTiming('tagMapUpdate', perf)
          updateTagRes = await Promise.all(
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
            updateTagRes.map((tag) => {
              return prisma.tagsOnBookmarks.upsert({
                create: {
                  bookmarkId: updateBookmarkRes.id,
                  tagId: tag.id,
                },
                update: {
                  bookmarkId: updateBookmarkRes.id,
                  tagId: tag.id,
                },
                where: {
                  bookmarkId_tagId: {
                    bookmarkId: updateBookmarkRes.id,
                    tagId: tag.id,
                  },
                },
              })
            })
          )
          setTiming('tagMapUpdate', perf)
        }

        setTiming('total', perf)
        // Generate Server-Timing headers
        res.setHeader(
          'Server-Timing',
          Object.entries(perf)
            .map(([name, measurements]) => {
              return `${name};dur=${measurements.dur}`
            })
            .join(',')
        )
        res.setHeader('Access-Control-Allow-Origin', '*')

        // Return response to client
        return res
          .status(200)
          .json({ data: { ...updateBookmarkRes, tags: updateTagRes ?? [] } })
      } else {
        console.error('ERR - Unauthorized attempt to PUT /api/bookmarks')
        return res.status(403).end('Unauthorized')
      }
    }
    case 'POST': {
      const perf = {
        total: {
          start: performance.now(),
        },
      }

      const {
        userId,
        url,
        title = '',
        category = '',
        desc = '',
        tags = [],
      } = body

      if (!url || !isAbsoluteUrl(url)) {
        return res.status(400).json({ message: 'URL Missing or Invalid' })
      }
      if (!userId) {
        console.error('ERR - Unauthorized attempt to POST /api/bookmarks')
        return res.status(403).end('Unauthorized')
      }

      let metadata = {
        title: '',
        image: '',
        description: '',
      }

      // First fetch any additional metadata about the URL
      setTiming('metadata', perf)
      const resp = await fetch(url)
      metadata = await metascraper({ html: await resp.text(), url: url })
      setTiming('metadata', perf)

      // If image hoster is enabled
      if (process.env.SUPABASE_URL) {
        // Generate image with puppeteer
        setTiming('puppeteer', perf)
        const imageRes = await fetch(
          `https://screenshot.briefkastenhq.com/api/image?url=${encodeURIComponent(
            url
          )}`
        )
        setTiming('puppeteer', perf)
        const imageBlob = await imageRes.blob()
        if (imageBlob.type === 'image/jpeg') {
          setTiming('supabaseUpload', perf)

          // Upload image blob to Supabase
          let { data, error } = await supabase.storage
            .from('bookmark-imgs')
            .upload(
              `${session?.user?.userId || userId}/${new URL(url).hostname}.jpg`,
              await imageBlob.arrayBuffer(),
              {
                contentType: 'image/jpeg',
                upsert: true,
              }
            )
          setTiming('supabaseUpload', perf)

          if (error) {
            throw error
          }

          if (data.Key) {
            metadata.image = `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`

            // Generate a blur placeholder
            setTiming('blurPlaceholder', perf)
            const { base64 } = await getPlaiceholder(metadata.image)
            metadata.imageBlur = base64
            setTiming('blurPlaceholder', perf)
          }
        }
      }

      // Begin inserting entry into db
      // First, the bookmark itself since we need its ID for later inserts
      setTiming('bookmarkUpsert', perf)
      const upsertBookmarkRes = await prisma.bookmark.upsert({
        include: {
          category: true,
        },
        create: {
          url,
          title: title ? title : metadata.title,
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
      setTiming('bookmarkUpsert', perf)

      let upsertTagRes
      // Next, if there are tags, insert them sequentially
      if (tags && tags.filter(Boolean).length) {
        setTiming('tagMapUpsert', perf)
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
        setTiming('tagMapUpsert', perf)
      }

      setTiming('total', perf)
      // Generate Server-Timing headers
      res.setHeader(
        'Server-Timing',
        Object.entries(perf)
          .map(([name, measurements]) => {
            return `${name};dur=${measurements.dur}`
          })
          .join(',')
      )
      res.setHeader('Access-Control-Allow-Origin', '*')

      // Return response to client
      return res
        .status(200)
        .json({ data: { ...upsertBookmarkRes, tags: upsertTagRes ?? [] } })
    }
    case 'GET': {
      const perfStart = performance.now()
      const { q, limit = 10 } = query
      const { authorization: userId } = headers

      if (!userId) {
        return res.status(400).json({ message: 'Missing required field(s)' })
      }

      try {
        const bookmarksResults = await prisma.bookmark.findMany({
          take: parseInt(limit),
          distinct: ['url'],
          select: {
            id: true,
            title: true,
            url: true,
            createdAt: true,
          },
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
        const perfStop = performance.now()
        const dur = perfStop - perfStart
        res.setHeader(
          'Server-Timing',
          `search;desc="Execute Search";dur=${dur}
          `.replace(/\n/g, '')
        )
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
        console.error('ERR - Unauthorized attempt to DELETE /api/bookmarks')
        return res.status(403).end('Unauthorized')
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'DELETE', 'POST', 'PUT'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}

export default handler
