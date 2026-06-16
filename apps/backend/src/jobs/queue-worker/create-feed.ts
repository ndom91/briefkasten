import { fetchFeed } from "../../lib/feed.js"
import { createFeedEntryBaseData } from "../../lib/feed-entry-data.js"
import debugFactory from "../../lib/log.js"
import { db } from "../../plugins/prisma.js"

const debug = debugFactory("backend:create-feed")

export interface CreateFeedData {
  userId: string
  feedUrl: string
}

const INITIAL_ITEMS_TO_FETCH = 20

export const createFeed = async (data: CreateFeedData) => {
  const feed = await fetchFeed({ url: data.feedUrl })
  if (!feed) {
    debug(`No feed data: ${data.feedUrl}`)
    return
  }

  debug(`Inserting feed: ${feed.self}`)

  const ingestedAt = new Date()

  await db.feed.create({
    data: {
      name: feed.title ?? feed.url ?? "",
      url: data.feedUrl,
      description: feed.description,
      language: feed.language,
      copyright: feed.copyright,
      lastFetched: new Date().toISOString(),
      user: {
        connect: {
          id: data.userId,
        },
      },
      feedEntries: {
        create: feed.items
          .sort((a, b) => {
            if (!a.published || !b.published) {
              return -1
            }
            if (a.published > b.published) {
              return -1
            }
            return 1
          })
          .slice(0, INITIAL_ITEMS_TO_FETCH)
          .map((item) => createFeedEntryBaseData({ ingestedAt, item, userId: data.userId })),
      },
    },
  })
  debug(`Feed Create Success ${feed.url}`)
}
