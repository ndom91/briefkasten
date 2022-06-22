import LogRocket from 'logrocket'
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

  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'development') {
    LogRocket.init('4ayekz/briefkasten')
    setupLogRocketReact(LogRocket)
    if (session?.user) {
      LogRocket.identify(session.user.userId, {
        name: session.user.name,
        email: session.user.email,
      })
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
