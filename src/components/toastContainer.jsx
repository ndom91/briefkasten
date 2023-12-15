import Toast from "./toast"
import { useToastStateContext } from "@/lib/toastContext"

export default function ToastContainer() {
  const { toasts } = useToastStateContext()

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 flex w-2/3 max-w-md flex-col items-end sm:top-10 sm:right-10 sm:w-2/6">
      {toasts?.map((toast) => (
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
