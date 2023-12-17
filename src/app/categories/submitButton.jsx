"use client"

import { useFormStatus } from "react-dom"
import { LoadingSpinner } from "@/components/loadingSpinner"

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="flex items-center justify-center space-x-1 rounded-md bg-slate-700 px-2 py-1 pr-3 font-medium text-white outline-none"
      aria-disabled={pending}
    >
      {pending ? (
        <LoadingSpinner />
      ) : (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      )}
      <span>{pending ? "Loading" : "Save"}</span>
    </button>
  )
}
