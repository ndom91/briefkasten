import { json, text } from "@sveltejs/kit"
import z from "zod"
import { requireUser } from "$/lib/auth"
import { db } from "$lib/prisma"
import type { RequestHandler } from "./$types"

const userSettingsSchema = z
  .object({
    data: z
      .object({
        settings: z
          .object({
            personal: z
              .object({
                compact: z.boolean().optional(),
              })
              .strict(),
            ai: z
              .object({
                tts: z
                  .object({
                    enabled: z.boolean(),
                    speaker: z.string(),
                    location: z.enum(["Browser", "Server"]),
                  })
                  .strict(),
                summarization: z
                  .object({
                    enabled: z.boolean(),
                  })
                  .strict(),
              })
              .strict(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict()

export const PUT: RequestHandler = async (event) => {
  try {
    const { userId } = requireUser(event)
    const { data } = userSettingsSchema.parse(await event.request.json())

    const prismaResult = await db.user.update({
      data: {
        settings: data.settings,
      },
      where: {
        id: userId,
      },
    })

    return json({ data: prismaResult })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: error instanceof z.ZodError ? 400 : 401 })
  }
}

export const fallback: RequestHandler = ({ request }) => {
  return text(`Invalid method ${request.method}`, { status: 405 })
}
