import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "../plugins/prisma.js"
import debugFactory from "./log.js"

const debug = debugFactory("backend:auth")

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [],
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    useSecureCookies: process.env.BETTER_AUTH_URL?.startsWith("https://") ?? false,
  },
})

export async function getSession(c: Context) {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
      query: { disableCookieCache: true },
    })
    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" })
    }

    debug("Validated Better Auth session", { userId: session.session.userId })
    return session
  } catch (error) {
    console.error(error)
    throw new HTTPException(401, { message: "Unauthorized" })
  }
}

export async function getUserId(c: Context) {
  const session = await getSession(c)
  return session.session.userId
}
