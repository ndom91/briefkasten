'use client'

import ToastContainer from '@/components/toastContainer'
import { ToastProvider } from '@/lib/toastContext'

export default function ToastContext({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}
