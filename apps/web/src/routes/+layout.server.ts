import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = (event) => {
  const { session, user } = event.locals

  if (!session?.userId && event.url.pathname !== "/login") {
    const fromUrl = event.url.pathname + event.url.search
    redirect(307, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
  }

  // If there is a session, don't let the user stay on "/login"
  if (session?.userId && event.url.pathname === "/login") {
    const redirectTo = event.url.searchParams.get("redirectTo")
    redirect(303, redirectTo ? `/${decodeURIComponent(redirectTo).slice(1)}` : "/")
  }

  return {
    session,
    user,
  }
}
