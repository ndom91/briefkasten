import { isHttpError, json, text } from "@sveltejs/kit"
import z from "zod"
import { requireUser } from "$lib/auth"
import { db } from "$lib/prisma"
import { createBookmarks } from "$lib/server/bookmarks"
import type { RequestHandler } from "./$types"

const bookmarkUpdateInputSchema = z
  .object({
    id: z.string().cuid(),
    update: z
      .object({
        archived: z.boolean(),
      })
      .strict(),
  })
  .strict()

// Get more Bookmarks
export const GET: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const skip = Number(event.url.searchParams.get("skip") ?? "0")
    const limit = Number(event.url.searchParams.get("limit") ?? "10")
    const archived = event.url.searchParams.get("archived") === "true"
    const query = event.url.searchParams.get("q")?.trim()

    if (limit > 100) {
      return new Response(null, {
        status: 401,
        statusText: "Attempted to load too many items",
      })
    }

    const search = query ? query.split(/\s+/).join(" & ") : undefined

    const [data, count] = (await db.bookmark.findManyAndCount({
      take: limit,
      skip,
      where: {
        userId,
        archived,
        ...(search
          ? {
              OR: [{ title: { search } }, { url: { search } }, { desc: { search } }],
            }
          : {}),
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    const bookmarks = data.map((bookmark) => {
      return {
        ...bookmark,
        tags: bookmark.tags.map((tag: LoadBookmark["tags"][number]) => tag.tag),
      }
    }) as LoadBookmarkFlatTags[]

    return json({
      data: bookmarks,
      count,
    })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: 401 })
  }
}

// Update Bookmark
export const PUT: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const { id, update } = bookmarkUpdateInputSchema.parse(await event.request.json())

    const data = await db.bookmark.update({
      data: {
        archived: update.archived,
      },
      where: {
        id,
        userId,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    })

    return json({ data })
  } catch (error) {
    console.error(String(error))
    return new Response(String(error), { status: error instanceof z.ZodError ? 400 : 401 })
  }
}

// Create Bookmark(s)
export const POST: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const inputData = await event.request.json()
    const bookmarks = await createBookmarks({
      inputData,
      userId,
      eventFetch: event.fetch,
      cookieHeader: event.request.headers.get("cookie") ?? "",
    })

    return json({ data: bookmarks, count: bookmarks.length })
  } catch (error) {
    console.error(String(error))
    if (isHttpError(error)) {
      return new Response(error.body.message, { status: error.status })
    }

    return new Response(String(error), { status: error instanceof z.ZodError ? 400 : 500 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`, { status: 405 })
}
