'use client'

import * as Swetrix from 'swetrix'
import { Suspense } from 'react'
import { usePathname } from 'next/navigation'

function SwetrixComponent() {
  const pathname = usePathname()

  if (window.location.host === 'briefkastenhq.com') {
    Swetrix.init(process.env.NEXT_PUBLIC_SWETRIX_PROJECT, {
      apiURL: process.env.NEXT_PUBLIC_SWETRIX_API_HOST,
    })
    let url = pathname
    Swetrix.trackPageview(url)
  }
  return <div></div>
}

export default function Analytics() {
  return (
    <Suspense>
      <SwetrixComponent />
    </Suspense>
  )
}
