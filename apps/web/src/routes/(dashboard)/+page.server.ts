import { requireUser } from "$/lib/auth"
import { db } from "$/lib/prisma"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  event.depends("app:feeds")

  const { userId } = requireUser(event, { redirectToLogin: true })

  try {
    const [feedData, feedCount] = await db.feedEntry.findManyAndCount({
      take: 10,
      skip: 0,
      where: {
        userId,
        unread: true,
      },
      include: {
        feed: true,
        feedMedia: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      feedEntries: {
        data: feedData,
        count: feedCount,
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return { feedEntries: { data: [], count: 0 }, error }
  }
}
