import { json } from "@sveltejs/kit"
import { requireUser } from "$lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

// Full client-side search index. Returns all non-archived bookmarks for the
// user, unpaginated, so fuse.js can build a complete in-memory index.
export const GET: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)

    const data = (await db.bookmark.findMany({
      where: {
        userId,
        archived: false,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as LoadBookmark[]

    const bookmarks = data.map((bookmark) => {
      return {
        ...bookmark,
        tags: bookmark.tags.map((tag: LoadBookmark["tags"][number]) => tag.tag),
      }
    }) as LoadBookmarkFlatTags[]

    return json({
      data: bookmarks,
      count: bookmarks.length,
    })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: 401 })
  }
}
