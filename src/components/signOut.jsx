import { SignOutAction } from "./actions"

export function SignOut({ active }) {
  return (
    <form action={SignOutAction} className="w-full">
      <button
        className={`${
          active ? "bg-slate-500 text-white" : "text-gray-900"
        } group flex w-full items-center justify-start space-x-2 rounded-md px-2 py-2 text-sm`}
      >
        <svg
          className={`h-5 w-5 ${active ? "text-slate-200" : "text-slate-600"}`}
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </form>
  )
}
