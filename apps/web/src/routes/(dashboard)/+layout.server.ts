import { superValidate } from "sveltekit-superforms"
import { zod4 } from "sveltekit-superforms/adapters"
import type { Tag } from "$/prisma-client/client"
import { requireUser } from "$/lib/auth"
import { db } from "$lib/prisma"
import { formSchema } from "$schemas/quick-add"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async (event) => {
  event.depends("app:bookmarks", "app:feeds")

  // Auth guard MUST be outside the try/catch: redirect() throws, and a catch
  // would swallow it, letting the load fall through to queries with
  // userId=undefined (Prisma drops the filter and returns every user's data).
  const { userId } = requireUser(event, { redirectToLogin: true })

  try {
    const quickAddForm = await superValidate(zod4(formSchema), {
      id: "quickAddForm",
    })
    const [categories, tags] = await db.$transaction([
      db.category.findMany({
        where: { userId },
      }),
      db.tag.findMany({
        where: { userId },
      }),
    ])

    const [bookmarkData, bookmarkCount] = (await db.bookmark.findManyAndCount({
      take: 10,
      skip: 0,
      where: {
        userId,
        archived: false,
      },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    })) as unknown as [LoadBookmark[], number]

    const bookmarks = bookmarkData.map((bookmark) => {
      return {
        ...bookmark,
        tags: bookmark.tags.map((tag: { tag: Tag }) => tag.tag),
      }
    }) as LoadBookmarkFlatTags[]

    const [feedEntryData, feedEntryCount] = await db.feedEntry.findManyAndCount({
      take: 10,
      skip: 0,
      where: { userId },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { published: "desc" },
    })

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

    return {
      bookmarks: {
        data: bookmarks,
        count: bookmarkCount,
      },
      feedEntries: {
        data: feedEntryData,
        count: feedEntryCount ?? 0,
      },
      feeds: {
        data: feedData.map((feed) => {
          return {
            ...feed,
            visible: true,
          }
        }) as unknown as (LoadFeed & { visible: boolean })[],
        count: feedCount ?? 0,
      },
      quickAddForm,
      tags,
      categories: categories.map((category) => ({
        ...category,
        visible: true,
      })),
    }
  } catch (error) {
    console.error(String(error))
    return {
      categories: [],
      tags: [],
      error,
      quickAddForm: undefined,
    }
  }
}
