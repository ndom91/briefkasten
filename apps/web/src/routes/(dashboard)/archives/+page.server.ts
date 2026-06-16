import { fail } from "@sveltejs/kit"
import { getUserId, requireUser } from "$lib/auth"
import { db } from "$lib/prisma"
import type { Actions, PageServerLoad } from "./$types"
import type { Tag } from "$/prisma-client/client"

export const actions: Actions = {
  deleteBookmark: async (event) => {
    const userId = getUserId(event.locals)
    if (!userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }
    const data = await event.request.formData()
    const bookmarkId = data.get("bookmarkId")?.toString() || ""

    if (!bookmarkId) {
      return fail(400)
    }

    await db.bookmark.delete({
      where: {
        id: bookmarkId,
        userId,
      },
    })
    return { type: "success", message: "Deleted Bookmark" }
  },
}

export const load: PageServerLoad = async (event) => {
  const { session, userId } = requireUser(event, { redirectToLogin: true })
  try {
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "20")

    const [data, count] = (await db.bookmark.findManyAndCount({
      take: limit + skip,
      skip,
      where: {
        userId,
        archived: true,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    const bookmarks = data.map((bookmark) => {
      return { ...bookmark, tags: bookmark.tags.map((tag: { tag: Tag }) => tag.tag) }
    })

    return {
      session,
      bookmarks: {
        data: bookmarks,
        count,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return {
      bookmarks: {
        data: [],
        count: 0,
      },
      session,
      error,
    }
  }
}
