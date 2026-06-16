import { text } from "@sveltejs/kit"
import { requireUser } from "$/lib/auth"
import { createEdgeSpeech } from "$lib/server/generate-tts"
import type { RequestHandler } from "./$types"

export const POST: RequestHandler = async (event) => {
  try {
    requireUser(event)

    const { text, speaker } = await event.request.json()

    const edgeSpeech = await createEdgeSpeech({
      payload: {
        input: text,
        options: {
          voice: speaker,
        },
      },
    })

    return edgeSpeech
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    return new Response(String(error), { status: 401 })
  }
}

export const fallback: RequestHandler = async ({ request }) => {
  return text(`Invalid method ${request.method}`, { status: 405 })
}
