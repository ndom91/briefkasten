import { fail } from "@sveltejs/kit"
import { getUserId, requireUser } from "$/lib/auth"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { db } from "$lib/prisma"
import type { Actions, PageServerLoad } from "./$types"

export const actions: Actions = {
  deleteFeed: async (event) => {
    const userId = getUserId(event.locals)
    if (!userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    const data = await event.request.formData()
    const feedId = String(data.get("feedId"))

    if (!feedId) {
      return fail(400, { type: "error", message: "Missing Feed ID" })
    }

    await db.feed.delete({
      where: {
        id: feedId,
        userId,
      },
    })
    return { type: "success", message: "Deleted Feed" }
  },
  addFeed: async (event) => {
    if (!PUBLIC_WORKER_URL) {
      return fail(500, { type: "error", error: "Worker URL Not Configured!" })
    }
    const userId = getUserId(event.locals)
    if (!userId) {
      return fail(401, { type: "error", error: "Unauthenticated" })
    }

    try {
      const data = await event.request.formData()
      const feedUrl = String(data.get("feedUrl"))

      if (!feedUrl) {
        return fail(400, { type: "error", message: "Feed URL Required" })
      }

      const feedRes = await event.fetch(`${PUBLIC_WORKER_URL}/v1/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: event.request.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          feedUrl,
        }),
      })
      if (!feedRes.ok) {
        return fail(500, { type: "error", error: "Failed to add feed" })
      }

      return { type: "success", message: "Feed queued" }
    } catch (error) {
      console.error("Error:", String(error))

      return fail(500, { type: "error", message: "Failed to queue feed" })
    }
  },
}

export const load: PageServerLoad = async (event) => {
  const { session, userId } = requireUser(event, { redirectToLogin: true })

  try {
    const [feedData, feedCount] = await db.feed.findManyAndCount({
      where: { userId },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        language: true,
        userId: true,
        lastFetched: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            feedEntries: { where: { unread: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const [bookmarkData, bookmarkCount] = (await db.bookmark.findManyAndCount({
      where: {
        userId,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    const bookmarksFlatTags = bookmarkData.map((bookmark) => {
      return {
        ...bookmark,
        tags: bookmark.tags.map((tag: LoadBookmark["tags"][number]) => tag.tag),
      }
    })

    const user = await db.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        settings: true,
        createdAt: true,
      },
      where: {
        id: userId,
      },
    })

    return {
      user,
      session,
      feeds: {
        data: feedData,
        count: feedCount,
      },
      bookmarks: {
        data: bookmarksFlatTags,
        count: bookmarkCount,
      },
    }
  } catch (error) {
    console.error("Err: ", String(error))

    return {
      bookmarks: { count: 0, data: [] },
      feedEntries: { count: 0, data: [] },
      error,
    }
  }
}
