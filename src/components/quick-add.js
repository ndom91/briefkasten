import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToggle } from 'react-use'
import { useStore } from '@/lib/store'
// import Chip from '@/components/chip'

export default function QuickAdd({ categories }) {
  const [url, setUrl] = useState('')
  const [open, toggleOpen] = useToggle(false)
  const { data: session } = useSession()
  const addBookmark = useStore((state) => state.addBookmark)

  async function submitUrl() {
    try {
      const res = await fetch('/api/bookmarks/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, userId: session?.user?.userId }),
      })
      const data = await res.json()
      addBookmark({
        url,
        createdAt: data.createdAt,
        id: data.id,
        desc: data.desc,
        image: data.image,
        title: data.title,
      })
    } catch (error) {
      console.error('[ERROR] Submitting URL', error)
    }
  }

  return (
    <>
      <div className="flex">
        <div className="flex min-w-0 flex-1">
          <button
            onClick={toggleOpen}
            className="flex w-10 items-center justify-center rounded-l-md border-transparent bg-gray-100 px-2 outline-none transition focus-within:z-10 focus-within:ring-2 focus-within:ring-slate-200 focus-within:ring-offset-2 focus-within:ring-offset-white focus:outline-none"
          >
            <svg
              title="down-chevron"
              className={`absolute h-6 w-6 transition ${
                open ? 'opacity-100' : 'opacity-0'
              }`}
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
            <svg
              title="right-chevron"
              className={`absolute h-6 w-6 transition ${
                !open ? 'opacity-100' : 'opacity-0'
              }`}
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
          </button>
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
            className="block w-full rounded-md border border-transparent bg-slate-800 p-3 text-base font-medium text-white shadow transition duration-500 ease-in-out hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white sm:px-8"
          >
            Save
          </button>
        </div>
      </div>
      {open && (
        <section className="rounded-md bg-gray-100 p-3 transition duration-500 ease-in-out">
          <div className="flex flex-col space-y-1">
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="category"
                className="text-xs font-medium uppercase tracking-tight text-gray-500"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="block w-full truncate rounded-md border-transparent pr-8 text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
              >
                {categories.map((category, i) => {
                  return (
                    <option defaultValue={i === 0} key={i}>
                      {category.name} - {category.description}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="tags"
                className="text-xs font-medium uppercase tracking-tight text-gray-500"
              >
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="block w-full truncate rounded-md border-transparent pr-8 text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
              />
            </div>
            <div className="w-full overflow-hidden rounded-md px-2 transition focus-within:border-slate-200 focus-within:ring-0">
              <label
                htmlFor="description"
                className="text-xs font-medium uppercase tracking-tight text-gray-500"
              >
                Description
              </label>
              <textarea
                rows="3"
                id="description"
                placeholder=""
                className="block w-full rounded-md border-transparent bg-white text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:opacity-75"
              ></textarea>
              <div className="flex items-center justify-between pb-[0.2rem] pt-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded bg-white px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded bg-white px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                    className="inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded bg-white px-2 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-100 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                <span className="rounded-lg bg-gray-200 px-2 py-1 text-[0.6rem] uppercase text-gray-400">
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
