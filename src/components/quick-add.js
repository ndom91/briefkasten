import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToggle } from 'react-use'
import Chip from '@/components/chip'

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
      {open && (
        <section className="rounded-md bg-gray-100 p-4">
          <div className="flex flex-col space-y-4">
            <div className="w-full space-y-0.5">
              <label
                htmlFor="basic"
                className="text-xs font-medium text-gray-500"
              >
                Category
              </label>
              <select
                id="basic"
                name="basic"
                className="block w-full truncate rounded-md border-gray-200 pr-8 text-sm transition focus:border-blue-600 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
              >
                <option selected>Tech</option>
                <option>Politics</option>
                <option>Web</option>
              </select>
            </div>
            <div className="w-full overflow-hidden rounded-md border border-gray-200 transition focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
              <label htmlFor="editor" className="sr-only">
                Description
              </label>
              <textarea
                rows="4"
                id="editor"
                placeholder="Write a comment"
                className="block w-full border-0 bg-transparent bg-white text-sm transition focus:border-blue-600 focus:ring-0 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
              ></textarea>
              <div className="flex items-center justify-between p-2">
                <div className="flex space-x-1">
                  <button
                    type="button"
                    className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded bg-white px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 stroke-gray-500"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M96,176l95.8-92.2a28,28,0,0,0-39.6-39.6L54.1,142.1a47.9,47.9,0,0,0,67.8,67.8L204,128"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded bg-white px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 stroke-gray-500"
                      viewBox="0 0 256 256"
                    >
                      <rect
                        x="88"
                        y="24"
                        width="80"
                        height="136"
                        rx="40"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></rect>
                      <path
                        d="M208,120a80,80,0,0,1-160,0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></path>
                      <line
                        x1="128"
                        y1="200"
                        x2="128"
                        y2="232"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></line>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded bg-white px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 fill-gray-500 stroke-gray-500"
                      viewBox="0 0 256 256"
                    >
                      <circle
                        cx="128"
                        cy="128"
                        r="96"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></circle>
                      <circle cx="92" cy="108" r="16"></circle>
                      <circle cx="164" cy="108" r="16"></circle>
                      <path
                        d="M169.6,152a48.1,48.1,0,0,1-83.2,0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></path>
                    </svg>
                  </button>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-sm leading-tight text-gray-400">
                  Leave blank to use the default page description
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
