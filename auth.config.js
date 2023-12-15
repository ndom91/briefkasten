import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
// import Email from 'next-auth/providers/email' @NOTE: Removing support
import Keycloak from 'next-auth/providers/keycloak'
import Authentik from 'next-auth/providers/authentik'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'

// import type { NextAuthConfig } from "next-auth"
const providers = [
  process.env.GITHUB_ID ? GitHub : null,
  process.env.GOOGLE_ID ? Google : null,
  process.env.KEYCLOAK_ID &&
    Keycloak({
      clientId: process.env.KEYCLOAK_ID,
      name: process.env.KEYCLOAK_NAME,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      allowDangerousEmailAccountLinking:
        process.env.KEYCLOAK_DANGER_EMAIL_ACC_LINK,
    }),
  process.env.AUTHENTIK_ID &&
    Authentik({
      name: process.env.AUTHENTIK_NAME,
      clientId: process.env.AUTHENTIK_ID,
      clientSecret: process.env.AUTHENTIK_SECRET,
      issuer: process.env.AUTHENTIK_ISSUER,
    }),
].filter(Boolean)

// Next-auth passes through all options gotten from keycloak, excessive ones must be removed.
const adapterOverwrite = PrismaAdapter(prisma)

const adapter = {
  ...adapterOverwrite,
  linkAccount: (account) => {
    delete account['not-before-policy']
    delete account['refresh_expires_in']
    return adapterOverwrite.linkAccount(account)
  },
}

export default {
  providers,
  adapter: adapter,
  pages: {
    signIn: '/auth/signin',
  },
}
// } satisfies NextAuthConfig
