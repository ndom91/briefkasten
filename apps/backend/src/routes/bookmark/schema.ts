import { zValidator } from "@hono/zod-validator"
import { z } from "zod"

const bookmarkImageSchema = z.object({
  data: z.array(
    z
      .object({
        url: z
          .string({
            error: "URL is required.",
          })
          .url(),
      })
      .passthrough()
  ),
})

export const bookmarkImageBodyValidator = zValidator("json", bookmarkImageSchema)
