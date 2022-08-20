import LogRocket from 'logrocket'
import Tracker from '@openreplay/tracker/cjs'
import setupLogRocketReact from 'logrocket-react'
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
  if (
    typeof window !== 'undefined' &&
    window._lr_loaded !== true &&
    process.env.NODE_ENV !== 'development'
  ) {
    LogRocket.init('4ayekz/briefkasten')
    setupLogRocketReact(LogRocket)
    if (session?.user) {
      LogRocket.identify(session.user.userId, {
        name: session.user.name,
        email: session.user.email,
      })
    }
  }

  // OpenReplay
  if (
    typeof window !== 'undefined' &&
    !window.__OPENREPLAY__ &&
    process.env.NODE_ENV !== 'development'
  ) {
    const tracker = new Tracker({
      projectKey: '8yWHdmOk4sTi352UaFdk',
      ingestPoint: 'https://openreplay.ndo.dev/ingest',
      onStart: () => {
        tracker.setUserID(session.user.userId)
      },
    })

    if (session?.user) {
      tracker.start()
    }
  }

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
