import { error as kitError, type RequestEvent } from "@sveltejs/kit"
import z from "zod"
import type { Tag } from "$/prisma-client/client"
import { PUBLIC_WORKER_URL } from "$env/static/public"
import { db } from "$lib/prisma"
import { fetchBookmarkMetadata } from "$lib/server/fetchBookmarkMetadata"

export const bookmarkCreateInputSchema = z
  .object({
    title: z.string().optional().nullable(),
    url: z.string().url(),
    desc: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    createdAt: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).optional(),
  })
  .strict()

type CreateBookmarksOptions = {
  inputData: unknown
  userId: string
  eventFetch: RequestEvent["fetch"]
  cookieHeader: string
}

export const createBookmarks = async ({
  inputData,
  userId,
  eventFetch,
  cookieHeader,
}: CreateBookmarksOptions) => {
  const data = z.array(bookmarkCreateInputSchema).parse(inputData)

  const bookmarkData = await Promise.all(
    data.map(async (bookmark) => {
      if (bookmark.categoryId) {
        const category = await db.category.findFirst({
          where: {
            id: bookmark.categoryId,
            userId,
          },
          select: {
            id: true,
          },
        })

        if (!category) {
          kitError(400, { message: "Invalid category" })
        }
      }

      const { imageUrl, imageBlur, metadata } = await fetchBookmarkMetadata(bookmark.url)
      const tagNames = Array.from(new Set(bookmark.tags?.map((tag) => tag.trim()).filter(Boolean)))

      return {
        ...bookmark,
        tags: tagNames,
        userId,
        image: imageUrl,
        imageBlur,
        desc: bookmark.desc ?? metadata.description,
        title: bookmark.title ?? metadata.title ?? metadata.description,
        metadata,
      }
    })
  )

  const bookmarksByUrl = new Map<string, (typeof bookmarkData)[number]>()
  for (const bookmark of bookmarkData) {
    const existingBookmark = bookmarksByUrl.get(bookmark.url)
    bookmarksByUrl.set(
      bookmark.url,
      existingBookmark
        ? {
            ...existingBookmark,
            tags: Array.from(new Set([...existingBookmark.tags, ...bookmark.tags])),
          }
        : bookmark
    )
  }

  const uniqueBookmarkData = Array.from(bookmarksByUrl.values())
  const requestTagNames = Array.from(
    new Set(uniqueBookmarkData.flatMap((bookmark) => bookmark.tags))
  )
  if (requestTagNames.length) {
    await db.tag.createMany({
      data: requestTagNames.map((name) => ({
        name,
        userId,
      })),
      skipDuplicates: true,
    })
  }

  const upsertResponse = await Promise.all(
    uniqueBookmarkData.map(({ tags, ...bookmark }) => {
      return db.bookmark.upsert({
        where: {
          url_userId: {
            url: bookmark.url,
            userId,
          },
        },
        create: {
          ...bookmark,
          tags: tags.length
            ? {
                create: tags.map((name) => ({
                  tag: {
                    connect: {
                      name_userId: {
                        name,
                        userId,
                      },
                    },
                  },
                })),
              }
            : undefined,
        },
        update: {
          archived: false,
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
      })
    })
  )

  if (PUBLIC_WORKER_URL) {
    await eventFetch(`${PUBLIC_WORKER_URL}/v1/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        data: upsertResponse
          .filter((bookmark) => !bookmark.image)
          .map((bookmark) => ({ url: bookmark.url })),
      }),
    })
  }

  return upsertResponse.map((bookmark) => {
    return { ...bookmark, tags: bookmark.tags.map((tag: { tag: Tag }) => tag.tag) }
  }) as LoadBookmarkFlatTags[]
}
