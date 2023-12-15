import prisma from "@/lib/prisma"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { withSentry } from "@sentry/nextjs"

export default withSentry(async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, body } = req

  if (session) {
    switch (method) {
      case "POST": {
        // Begin inserting into db
        // First, bookmark since we need its ID for later inserts
        try {
          const upsertBookmarkRes = await prisma.bookmark.createMany({
            data: body,
          })

          return res.status(200).json({ data: upsertBookmarkRes })
        } catch (error) {
          console.error(error)
          const { code, message } = error
          return res.status(500).json({
            code,
            data:
              code === "P2002"
                ? "Unique constraint violation. Bookmark url already exists"
                : message,
          })
        }
      }
      default: {
        res.setHeader("Allow", ["POST"])
        return res.status(405).end(`Method ${method} Not Allowed`)
      }
    }
  } else {
    console.error("ERR - Unauthorized attempt at /api/bookmarks/bulk")
    return res.status(403).end("Unauthorized")
  }
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
}
