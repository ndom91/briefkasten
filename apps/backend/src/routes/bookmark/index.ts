import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { getUserId } from "../../lib/auth.js"
import { actions } from "../../lib/constants.js"
import { screenshotQueue } from "../../plugins/queue.js"
import { bookmarkImageBodyValidator } from "./schema.js"

const api = new Hono<{
  Variables: {
    userId: string
  }
}>()

api.use("*", async (c, next) => {
  c.set("userId", await getUserId(c))
  await next()
})

api.post("/", bookmarkImageBodyValidator, async (c) => {
  try {
    const userId = c.get("userId")
    const body = c.req.valid("json")

    for (const bookmark of body.data) {
      void screenshotQueue
        .push({
          action: actions.ADD_SCREENSHOT,
          data: {
            url: bookmark.url,
            userId,
          },
        })
        .catch((error) => console.error(error))
    }

    return c.text("Queued", 202)
  } catch (error) {
    console.error(error)
    throw new HTTPException(500, { message: String(error) })
  }
})

export default api
