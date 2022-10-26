'use client'

import { SessionProvider } from 'next-auth/react'

export default function AuthContext({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}
