import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const schema = z.object({
  feedUrl: z.string().url(),
})

export const feedBodySchema = zValidator("json", schema)
