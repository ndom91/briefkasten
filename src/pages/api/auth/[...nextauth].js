import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prisma'
import { html } from '@/lib/helpers'

const providers = []

if (process.env.GITHUB_ID) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  )
}
if (process.env.GOOGLE_ID) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    })
  )
}
if (process.env.KEYCLOAK_ID) {
  providers.push(
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      name: process.env.KEYCLOAK_NAME,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      allowDangerousEmailAccountLinking: process.env.KEYCLOAK_DANGER_EMAIL_ACC_LINK,
    })
  )
}
if (
  (process.env.SMTP_SERVER && process.env.SMTP_FROM) ||
  process.env.SENDGRID_API
) {
  const emailProviderSettings = {}
  if (process.env.SMTP_SERVER && process.env.SMTP_FROM) {
    emailProviderSettings.server = process.env.SMTP_SERVER
    emailProviderSettings.from = process.env.SMTP_FROM
  }
  if (process.env.SENDGRID_API) {
    emailProviderSettings.sendVerificationRequest = async (params) => {
      const { identifier: email } = params

      try {
        const sendResponse = await fetch(
          'https://api.sendgrid.com/v3/mail/send',
          {
            body: JSON.stringify({
              personalizations: [{ to: [{ email: email }] }],
              from: {
                email: 'noreply@briefkastenhq.com',
              },
              subject: 'Briefkasten Sign In',
              content: [
                {
                  type: 'text/html',
                  value: html(params),
                },
              ],
            }),
            headers: {
              Authorization: `Bearer ${process.env.SENDGRID_API}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }
        )

        if (!sendResponse.ok) {
          const responseJson = await sendResponse.json()
          throw new Error(JSON.stringify(responseJson.errors))
        }
      } catch (e) {
        console.error('Could not send Email', e)
      }
    }
  }
  providers.push(EmailProvider(emailProviderSettings))
}

export const authOptions = {
  providers,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, user }) {
      session.user.userId = user.id
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
}

// Next-auth passes through all options gotten from keycloak, excessive ones must be removed.
const adapterOverwrite = PrismaAdapter(prisma)

authOptions.adapter = {
  ...adapterOverwrite,
  linkAccount: (account) => {
    delete account['not-before-policy']
    delete account['refresh_expires_in']
    return adapterOverwrite.linkAccount(account)
  },
}

export default NextAuth(authOptions)
