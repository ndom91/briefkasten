import { SessionProvider } from 'next-auth/react'
import { useCreateStore, Provider } from '@/lib/store'
import '../styles/globals.css'

export default function Briefkasten({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const createStore = useCreateStore(pageProps.initialZustandState)

  return (
    <Provider createStore={createStore}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Provider>
  )
}
