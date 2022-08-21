import prisma from '@/lib/prisma'
import { getPlaiceholder } from 'plaiceholder'
import { supabase } from '@/lib/supabaseClient'
import { getSession } from 'next-auth/react'
import { prepareBase64DataUrl } from '@/lib/helpers'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (session) {
    const {
      query: { fileName, id },
      method,
      body,
    } = req

    if (!body) {
      console.error('ERR - Missing Image Body')
      return res.status(403).end('Missing Body')
    }

    switch (method) {
      case 'PUT':
        try {
          let { data, error } = await supabase.storage
            .from('bookmark-imgs')
            .upload(
              `${session.user?.userId}/${fileName}.png`,
              Buffer.from(prepareBase64DataUrl(body), 'base64'),
              {
                contentType: 'image/png',
                upsert: true,
              }
            )

          if (error) {
            throw error
          }

          const { base64 } = await getPlaiceholder(
            `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`
          )

          // Save absolute image URL to database
          await prisma.bookmark.update({
            where: { id },
            data: {
              image: `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`,
              imageBlur: base64,
            },
          })

          // Return image details to frontend
          return res.status(200).json({
            message: `Uploaded ${session.user?.userId}/${fileName}.jpg`,
            image: {
              url: `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`,
              filePath: `${session.user?.userId}/${fileName}.jpg`,
            },
          })
        } catch (error) {
          console.error('ERR', error)
          return res.status(500).json({ message: error })
        }
      default:
        res.setHeader('Allow', ['PUT'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  } else {
    console.error('ERR - Unauthorized attempt at /api/bookmarks/uploadImage')
    return res.status(403).end('Unauthorized')
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
