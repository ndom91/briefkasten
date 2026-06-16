import { Hono } from "hono"
import { getUserId } from "../../lib/auth.js"
import { actions } from "../../lib/constants.js"
import { feedQueue } from "../../plugins/queue.js"
import { feedBodySchema } from "./schema.js"

const api = new Hono<{
  Variables: {
    userId: string
  }
}>()

api.use("*", async (c, next) => {
  c.set("userId", await getUserId(c))
  await next()
})

api.get("/", (c) => {
  try {
    return c.json({ queueLength: feedQueue.length() })
  } catch (error) {
    return c.json({ error }, 500)
  }
})

api.post("/", feedBodySchema, async (c) => {
  try {
    const userId = c.get("userId")
    const { feedUrl } = c.req.valid("json")

    void feedQueue
      .push({
        action: actions.ADD_FEED,
        data: {
          feedUrl,
          userId,
        },
      })
      .catch((error) => console.error(error))

    return c.json({ feedUrl }, 202)
  } catch (error) {
    console.error(error)
    return c.json({ error }, 500)
  }
})

export default api
