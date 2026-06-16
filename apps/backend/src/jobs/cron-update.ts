import { format } from "@formkit/tempo"
import { Cron } from "croner"
import debugFactory from "../lib/log.js"
import type { Feed } from "../lib/types/zod.js"
import { updateFeed } from "../lib/update-feed.js"
import { db } from "../plugins/prisma.js"

const debug = debugFactory("backend:cron")

// Run every 10 min
export const updateJob = new Cron(
  "0 */10 * * * *",
  {
    timezone: "Europe/London",
    name: "refreshFeeds",
    protect: true,
    interval: 60,
  },
  async (cron: Cron) => {
    // TODO: Think of some way to dedupe feed updates across multiple users effectively.
    debug("Refreshing feeds")
    try {
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      const feeds: Feed[] = await db.feed.findMany({
        where: {
          lastFetched: {
            lte: oneHourAgo,
          },
        },
      })
      if (!feeds.length) {
        debug("0 feeds to refresh")
        debug(`Next run: ${format(cron.nextRun() ?? "", { date: "medium", time: "long" })}`)
        return
      }

      debug(`${feeds.length} feeds to refresh`)

      const results = await Promise.allSettled(
        feeds.map(async (feed) => {
          debug(`Updating feed - ${feed.url}`)
          await updateFeed(feed)

          // After successfully updating all new FeedEntry items, bump feed.lastFetched
          await db.feed.update({
            where: {
              id: feed.id,
            },
            data: {
              lastFetched: new Date().toISOString(),
            },
          })
        })
      )

      for (const result of results) {
        if (result.status === "rejected") {
          console.error(result.reason)
        }
      }
      debug(`Next run: ${format(cron.nextRun() ?? "", { date: "medium", time: "long" })}`)
    } catch (error) {
      console.error(error)
    }
  }
)
