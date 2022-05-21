import prisma from '@/lib/prisma'
import ImageKit from 'imagekit'
import { getSession } from 'next-auth/react'

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

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUB_KEY,
      privateKey: process.env.IMAGEKIT_PRIV_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL,
    })

    switch (method) {
      case 'PUT':
        try {
          // Upload image body to ImageKit
          const imageRes = await imagekit.upload({
            file: body,
            fileName: `${fileName}.png`,
          })

          // Save CDN ImageKit URL to database
          await prisma.bookmark.update({
            where: { id },
            data: {
              image: imageRes.url,
            },
          })

          // Return image details to frontend
          return res.status(200).json({
            message: `Uploaded ${imageRes.filePath}`,
            url: imageRes.url,
            filePath: imageRes.filePath,
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
