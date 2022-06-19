import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabaseClient'
import { getSession } from 'next-auth/react'
import { decode } from 'base64-arraybuffer'
import { base64ToBlob, base64ToArrayBuffer } from '@/lib/helpers'

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
          console.log('uploadImage.putBody', body.substring(0, 30))

          // console.log(
          //   'blob Output',
          //   base64ToBlob(body.split(',')[1], 'image/jpeg')
          // )
          // function unicodeBase64Decode(text) {
          //   text = text
          //     .replace(/\s+/g, '')
          //     .replace(/\-/g, '+')
          //     .replace(/\_/g, '/')
          //
          //   console.log(text.substring(0, 30))
          //   return decodeURIComponent(
          //     Array.prototype.map
          //       .call(atob(text), function (c) {
          //         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          //       })
          //       .join('')
          //   )
          // }
          //
          // const byteCharacters = atob(unicodeBase64Decode(body.split(',')[1]))
          //
          // const byteNumbers = new Array(byteCharacters.length)
          // for (let i = 0; i < byteCharacters.length; i++) {
          //   byteNumbers[i] = byteCharacters.charCodeAt(i)
          // }
          //
          // const byteArray = new Uint8Array(byteNumbers)
          //
          // const blob = new Blob([byteArray], { type: contentType })

          let { data, error } = await supabase.storage
            .from('bookmark-imgs')
            .upload(
              // base64ToBlob(body.split(',')[1], 'image/jpeg'),
              `${session.user?.userId}/${fileName}.jpg`,
              // Buffer.from(body, 'base64'),
              // base64ToArrayBuffer(body),

              decode(body),
              {
                upsert: true,
                contentType: 'image/jpeg',
              }
            )

          console.log('supabase.data', data)
          console.log('supabase.error', error)

          // Error = already exists
          if (error?.statusCode === '23505') {
            data = {
              Key: `bookmark-imgs/${session.user?.userId}/${fileName}.jpg`,
            }
          } else if (error) {
            throw error
          }

          // Save absoluteu image URL to database
          await prisma.bookmark.update({
            where: { id },
            data: {
              image: `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`,
            },
          })

          // Return image details to frontend
          return res.status(200).json({
            message: `Uploaded ${session.user?.userId}/${fileName}.jpg`,
            url: `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data.Key}`,
            filePath: `${session.user?.userId}/${fileName}.jpg`,
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

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
