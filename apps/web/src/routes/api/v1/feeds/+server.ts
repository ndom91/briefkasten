import { json, text } from "@sveltejs/kit"
import { requireUser } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

// Get FeedEntries
export const GET: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "10")
    const query = event.url.searchParams.get("q")?.trim()

    if (limit > 100) {
      return new Response(null, { status: 401, statusText: "Attempted to load too many items" })
    }

    const search = query ? query.split(/\s+/).join(" & ") : undefined

    const [data, count] = await db.feedEntry.findManyAndCount({
      take: limit,
      skip,
      where: {
        userId,
        ...(search
          ? {
              OR: [{ title: { search } }, { contentSnippet: { search } }],
            }
          : {}),
      },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    })

    return json({
      data,
      count,
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}

// Update FeedEntry
export const PUT: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const { feedEntry } = await event.request.json()

    const data = await db.feedEntry.update({
      data: {
        unread: feedEntry.unread,
      },
      where: {
        id: feedEntry.id,
        userId,
      },
      include: {
        feed: true,
        feedMedia: true,
      },
    })

    return json({ data })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`, { status: 405 })
}
