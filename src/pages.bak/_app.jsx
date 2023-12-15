/* import { useEffect } from 'react' */
import { SessionProvider } from 'next-auth/react'
import { useCreateStore, ZustandProvider } from '@/lib/store'
/* import * as Sentry from '@sentry/nextjs' */
import ToastContainer from '@/components/toastContainer'
import { ToastProvider } from '@/lib/toastContext'
import '../styles/globals.css'

export default function Briefkasten({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const createStore = useCreateStore(pageProps.initialZustandState)

  /* useEffect(() => { */
  /*   if (session?.user) { */
  /*     const { email, userId } = session */
  /*     Sentry.setUser({ id: userId, email }) */
  /*   } */
  /* }, [session, session?.user]) */

  return (
    <ZustandProvider createStore={createStore}>
      <SessionProvider session={session}>
        <ToastProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </ToastProvider>
      </SessionProvider>
    </ZustandProvider>
  )
}
