import { error, redirect, type RequestEvent } from "@sveltejs/kit"
import type { Session } from "$lib/auth-client"

type AuthEvent = Pick<RequestEvent, "locals" | "url">

type AuthenticatedUser = Session & {
  userId: string
}

export const getUserId = (locals: App.Locals): string | undefined => locals.session?.userId

export const requireUser = (
  event: AuthEvent,
  options: { redirectToLogin?: boolean } = {}
): AuthenticatedUser => {
  const { session, user } = event.locals

  if (!session?.userId) {
    if (options.redirectToLogin) {
      const fromUrl = event.url.pathname + event.url.search
      redirect(303, `/login?redirectTo=${encodeURIComponent(fromUrl)}`)
    }

    error(401, { message: "You are not logged in." })
  }

  return {
    session,
    user,
    userId: session.userId,
  }
}
