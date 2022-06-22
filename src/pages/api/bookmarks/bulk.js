import prisma from '@/lib/prisma'
import { getSession } from 'next-auth/react'

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
        // Schedule Cloudflare Worker to grab images for bulk imported Bookmarks as background job
        //
        // // Generate image with puppeteer if we didnt get one from metadata
        // const imageData = await fetch(
        //   `${baseUrl}/api/bookmarks/image?url=${encodeURIComponent(url)}`
        // )
        // const imageBlob = await imageData.blob()
        // const dataUrl = await asyncFileReader(imageBlob)
        //
        // // Upload Base64 image to ImageKit
        // const uploadRes = await fetch(
        //   `${baseUrl}/api/bookmarks/uploadImage?fileName=${
        //     new URL(url).hostname
        //   }`,
        //   {
        //     method: 'PUT',
        //     body: dataUrl,
        //   }
        // )
        // const uploadData = await uploadRes.json()
        // // Set image url
        // metadata.image = uploadData.image.url

        // Begin inserting into db
        // First, bookmark since we need its ID for later inserts
        const upsertBookmarkRes = await prisma.bookmark.createMany({
          data: body,
        })

        return res.status(200).json({ data: upsertBookmarkRes })
      }
      case 'GET': {
        return res.status(200).json({ results: ['Hello', 'World'] })
      }
      default: {
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } else {
    console.error('ERR - Unauthorized attempt at /api/bookmarks/bulk')
    return res.status(403).end('Unauthorized')
  }
}
