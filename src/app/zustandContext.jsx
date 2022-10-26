'use client'

import { useCreateStore, ZustandProvider } from '@/lib/store'

export default function ZustandContext({ children }) {
  const createStore = useCreateStore()

  return (
    <ZustandProvider createStore={createStore}> {children}</ZustandProvider>
  )
}
