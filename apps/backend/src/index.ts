import { format } from "@formkit/tempo"
import { type HttpBindings, serve } from "@hono/node-server"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { rateLimiter } from "hono-rate-limiter"

import { updateJob } from "./jobs/cron-update.js"
import { imageProxyHandler } from "./lib/imageProxy.js"
import { ensureBucket } from "./plugins/storage.js"
import bookmark from "./routes/bookmark/index.js"
import feed from "./routes/feed/index.js"

const img = new Hono<{ Bindings: HttpBindings }>()
img.use("/*", imageProxyHandler)

const app = new Hono<{ Bindings: HttpBindings }>()
app.route("/img", img)

app.use(logger())
app.use(prettyJSON())
if (process.env.NODE_ENV === "production") {
  app.use(
    rateLimiter({
      windowMs: 1 * 60 * 1000, // 1 minutes
      limit: 250,
      standardHeaders: "draft-6",
      keyGenerator: (c) => {
        return (
          c.req.header("X-Forwarded-For") ||
          c.req.header("X-Real-IP") ||
          c.req.header("CF-Connecting-IP") ||
          "127.0.0.1"
        )
      },
    })
  )
}

const BASE_PATH = "/v1"
app.route(`${BASE_PATH}/bookmark`, bookmark)
app.route(`${BASE_PATH}/feed`, feed)

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 8001

console.log(`
🚀 Server ready at: http://0.0.0.0:${port}
⌛ Next cron run at: ${format(updateJob.nextRun() ?? "", { date: "medium", time: "long" })}
`)

await ensureBucket()

serve({
  fetch: app.fetch,
  port,
})
