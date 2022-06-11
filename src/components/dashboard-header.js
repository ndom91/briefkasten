import { useState } from 'react'
import { viewTypes } from '@/lib/constants'
import Breadcrumbs from '@/components/breadcrumbs'

export default function DashboardHeader() {
  return (
    <div className="w-full px-4 py-6 flex justify-start items-center">
      <Breadcrumbs />
    </div>
  )
}
