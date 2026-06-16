import { requireUser } from "$lib/auth"
import type { PageServerLoad } from "./$types"
// import { fail, redirect } from "@sveltejs/kit"
// import type { Feed } from "$lib/types/zod.js"
// import { db } from "$lib/prisma"

export const load: PageServerLoad = async (event) => {
  const { session } = requireUser(event, { redirectToLogin: true })
  const { depends } = event

  depends("app:feeds")

  try {
    // const skip = Number(url.searchParams.get("skip") ?? "0")
    // const limit = Number(url.searchParams.get("limit") ?? "20")

    // if (limit > 100) {
    //   return fail(401, { type: "error", error: "Attempted to load too many items" })
    // }

    // const [feedEntryData, feedEntryCount] = await db.feedEntry.findManyAndCount({
    //   take: limit,
    //   skip,
    //   where: { userId: session?.user?.id },
    //   include: {
    //     feed: true,
    //     feedMedia: true,
    //   },
    //   orderBy: { published: "desc" },
    // })
    //
    // const [feedData, feedCount] = await db.feed.findManyAndCount({
    //   where: { userId: session?.user?.id },
    //   select: {
    //     id: true,
    //     name: true,
    //     url: true,
    //     description: true,
    //     language: true,
    //     userId: true,
    //     lastFetched: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     _count: {
    //       select: {
    //         feedEntries: { where: { unread: true } },
    //       },
    //     },
    //   },
    //   orderBy: { createdAt: "desc" },
    // })

    return {
      session,
      // feedEntries: {
      //   data: feedEntryData,
      //   count: feedEntryCount ?? 0,
      // },
      // feeds: {
      //   data: feedData.map((feed) => {
      //     return {
      //       ...feed,
      //       visible: true,
      //     }
      //   }) as unknown as (Feed & { visible: boolean })[],
      //   count: feedCount ?? 0,
      // },
    }
  } catch (error) {
    console.error(String(error))
    return {
      feedEntries: {
        data: {},
        count: 0,
      },
      feeds: {
        data: {},
        count: 0,
      },
      error,
      session,
    }
  }
}
