import Toast from './toast'
import { useToastStateContext } from '@/lib/toastContext'

export default function ToastContainer() {
  const { toasts } = useToastStateContext()

  return (
    <div className="pointer-events-none fixed top-10 right-10 z-50 flex w-2/6 max-w-md flex-col items-end">
      {toasts &&
        toasts.map((toast) => (
          <Toast
            id={toast.id}
            key={toast.id}
            type={toast.type}
            title={toast.title}
            body={toast.body}
          />
        ))}
    </div>
  )
}
