import { redirect } from "@sveltejs/kit"
import { getUserId } from "$lib/auth"
import { createBookmarks } from "$lib/server/bookmarks"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = async () => {
  redirect(303, "/?shared=method-not-supported")
}

export const POST: RequestHandler = async (event) => {
  const userId = getUserId(event.locals)
  if (!userId) {
    redirect(303, `/login?redirectTo=${encodeURIComponent("/?shared=auth-required")}`)
  }

  const formData = await event.request.formData()
  const sharedUrl = String(formData.get("link") ?? formData.get("text") ?? "")

  if (!sharedUrl) {
    redirect(303, "/?shared=missing-url")
  }

  try {
    await createBookmarks({
      inputData: [{ url: sharedUrl }],
      userId,
      eventFetch: event.fetch,
      cookieHeader: event.request.headers.get("cookie") ?? "",
    })
  } catch (error) {
    console.error(String(error))
    redirect(303, "/?shared=error")
  }

  redirect(303, "/?shared=true")
}
