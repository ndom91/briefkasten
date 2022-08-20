/* import LogRocket from 'logrocket' */
/* import setupLogRocketReact from 'logrocket-react' */
import { useEffect } from 'react'
import Tracker from '@openreplay/tracker/cjs'
import { SessionProvider } from 'next-auth/react'

import { useCreateStore, ZustandProvider } from '@/lib/store'
import ToastContainer from '@/components/toastContainer'
import { ToastProvider } from '@/lib/toastContext'
import '../styles/globals.css'

export default function Briefkasten({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const createStore = useCreateStore(pageProps.initialZustandState)

  // Logrocket
  /* if ( */
  /*   (typeof window !== 'undefined' && */
  /*     window._lr_loaded !== true && */
  /*     process.env.NEXT_PUBLIC_LOGROCKET_KEY, */
  /*   process.env.NODE_ENV !== 'development') */
  /* ) { */
  /*   LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_KEY) */
  /*   setupLogRocketReact(LogRocket) */
  /*   if (session?.user) { */
  /*     LogRocket.identify(session.user.userId, { */
  /*       name: session.user.name, */
  /*       email: session.user.email, */
  /*     }) */
  /*   } */
  /* } */

  // OpenReplay
  useEffect(() => {
    if (
      !window.__OPENREPLAY__ &&
      process.env.NEXT_PUBLIC_OPENREPLAY_KEY &&
      process.env.NEXT_PUBLIC_OPENREPLAY_URL &&
      process.env.NODE_ENV !== 'development'
    ) {
      const tracker = new Tracker({
        projectKey: process.env.NEXT_PUBLIC_OPENREPLAY_KEY,
        ingestPoint: process.env.NEXT_PUBLIC_OPENREPLAY_URL,
      })

      if (session?.user) {
        tracker.start({
          userID: session.user.userId,
          metadata: {
            name: session.user.name,
            email: session.user.email,
          },
        })
      }
    }
  }, [])

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
