import { db } from "../plugins/prisma.js"
import { createFeedEntryBaseData } from "./feed-entry-data.js"
import { fetchFeed } from "./feed.js"
import debugFactory from "./log.js"
import type { Feed } from "./types/zod.js"

interface MatchedFeedEntries {
  guid: string | null
}

const debug = debugFactory("backend:update-feed")

export const updateFeed = async (feed: Feed) => {
  const parsedFeed = await fetchFeed({
    url: feed.url,
    lastFetched: feed.lastFetched,
  })
  if (!parsedFeed) {
    debug(`No feed data: ${feed.url}`)
    return
  }

  // Find pre-existing feed entries
  const matchedFeedEntries: MatchedFeedEntries[] = await db.feedEntry.findMany({
    select: {
      guid: true,
    },
    where: {
      guid: {
        in: parsedFeed.items.map((item) => item.id).filter(Boolean) as string[],
      },
      feedId: feed.id,
      userId: feed.userId,
    },
  })

  // Diff pre-existing feed entries and new feed parsed items
  const newItems = parsedFeed.items.filter(
    (item) => !matchedFeedEntries.some((entry) => entry.guid === item.id)
  )

  // If no new items, return
  if (!newItems.length) {
    debug(`0 new items in ${feed.url}`)
    return
  }

  debug(`${newItems.length} new items ${feed.url}`)

  // If we have new items to insert, insert their FeedEntry and FeedEntryMedia
  const ingestedAt = new Date()
  const results = await Promise.allSettled(
    newItems.map((item) => {
      debug(`Inserting ${item.url}`)
      return db.feedEntry.create({
        data: {
          ...createFeedEntryBaseData({ ingestedAt, item, userId: feed.userId }),
          feed: {
            connect: {
              id: feed.id,
            },
          },
        },
      })
    })
  )

  const rejectedResults = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected"
  )
  for (const result of rejectedResults) {
    console.error(result.reason)
  }

  if (rejectedResults.length) {
    throw new AggregateError(
      rejectedResults.map((result) => result.reason),
      `Failed to insert ${rejectedResults.length} feed entries for ${feed.url}`
    )
  }
}
