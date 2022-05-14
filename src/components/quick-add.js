import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToggle } from 'react-use'

export default function QuickAdd() {
  const [url, setUrl] = useState('')
  const [open, toggleOpen] = useToggle(false)
  const { data: session } = useSession()

  async function submitUrl() {
    try {
      await fetch('/api/bookmarks/new', {
        method: 'POST',
        body: JSON.stringify({ url, userId: session?.user?.userId }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="flex">
        <div className="flex min-w-0 flex-1">
          <div className="focus flex items-center justify-center rounded-l-md border border-transparent bg-gray-100 px-2 transition duration-500 ease-in-out focus-within:z-10 focus-within:ring-2 focus-within:ring-slate-200 focus-within:ring-offset-2 focus-within:ring-offset-white">
            <button
              onClick={toggleOpen}
              className="outline-none focus:outline-none "
            >
              {open ? (
                <svg
                  title="down-chevron"
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              ) : (
                <svg
                  title="right-chevron"
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </div>
          <input
            type="url"
            className="block flex-1 transform rounded-r-md border border-transparent bg-gray-100 py-3 pl-2 pr-5 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:z-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white"
            placeholder="https://"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-3">
          <button
            type="submit"
            onClick={() => submitUrl()}
            name="addBookmark"
            className="block w-full rounded-lg border border-transparent bg-slate-400 px-5 py-3 text-base font-medium text-white shadow transition duration-500 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white sm:px-10"
          >
            Add
          </button>
        </div>
      </div>
      <section className=""></section>
    </>
  )
}
