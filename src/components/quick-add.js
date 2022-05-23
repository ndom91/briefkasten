import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useKeyPress, useToggle } from 'react-use'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'

export default function QuickAdd({ categories }) {
  const { data: session } = useSession()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0]?.name ?? '')
  const [tags, setTags] = useState('')
  const [desc, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, toggleOpen] = useToggle(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const addBookmark = useStore((state) => state.addBookmark)
  const insertRef = useRef()
  const toast = useToast(5000)

  useKeyPress((e) => {
    if (e.type === 'keyup') {
      if (e.altKey && e.key === 'a') {
        insertRef?.current?.focus()
      }
      if (e.altKey && e.key === 's') {
        submitUrl()
      }
    }
  })

  async function submitUrl() {
    try {
      setLoading(true)
      if (!url) {
        toast(toastTypes.ERROR, 'Missing required field(s)')
        setLoading(false)
        return
      }
      // Add Bookmark to DB via API
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          userId: session?.user?.userId,
          desc,
          category,
          tags: tags.split(' '),
          title,
        }),
      })
      if (res.status === 200) {
        toast(
          toastTypes.SUCCESS,
          `Successfully added "${new URL(url).hostname}"`
        )
        const { data } = await res.json()

        // Add new Bookmark to UI
        addBookmark({
          url,
          createdAt: data.createdAt,
          id: data.id,
          desc: data.desc,
          image: data.image,
          title: data.title,
          tags: data.tags,
          category: data.category,
        })

        // Empty fields and toggle closed
        setUrl('')
        setTitle('')
        setCategory('')
        setTags('')
        setDescription('')
        open && toggleOpen()
      } else {
        toast(toastTypes.ERROR, 'Error Saving')
      }
      setLoading(false)
    } catch (error) {
      console.error('[ERROR] Submitting URL', error)
      toast(toastTypes.ERROR, `Error adding "${new URL(url).hostname}"`)
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex">
        <div className="flex min-w-0 flex-1">
          <button
            onClick={toggleOpen}
            className="hidden w-10 items-center justify-center rounded-l-md border-transparent bg-slate-100 px-2 outline-none transition focus-within:z-10 focus-within:ring-2 focus-within:ring-slate-200 focus-within:ring-offset-2 focus-within:ring-offset-white focus:outline-none md:flex"
          >
            <svg
              title="down-chevron"
              className={`absolute h-6 w-6 transition ${
                open ? 'rotate-0' : '-rotate-90'
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
          </button>
          <div className="relative flex-1">
            {!searchFocused && url.length === 0 ? (
              <div className="pointer-events-none absolute left-2 top-[1.1rem] z-10 hidden text-xs text-slate-400 opacity-50 md:inline-block">
                <span className="rounded-md bg-slate-200 p-1 px-2 ">
                  <kbd className="">alt</kbd>
                  <span> + </span>
                  <kbd className="">a</kbd>
                </span>
                <span> to focus</span>
              </div>
            ) : null}
            <input
              type="url"
              ref={insertRef}
              className="block w-full transform rounded-r-md rounded-l-md border border-transparent bg-slate-100 py-3 pl-2 pr-5 text-base text-neutral-600 placeholder-slate-300 transition duration-500 ease-in-out focus:z-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white md:rounded-l-none md:placeholder:text-transparent"
              placeholder="    Add.."
              value={url}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChange={(event) => setUrl(event.target.value)}
            />
            <div className="absolute right-4 top-3 hidden rounded-md bg-slate-200 p-1 px-2 text-xs text-slate-400 md:inline-block">
              <kbd className="">alt</kbd>
              <span> + </span>
              <kbd className="">s</kbd>
            </div>
          </div>
        </div>
        <div className="ml-2 sm:ml-3">
          <button
            type="submit"
            form="url"
            onClick={() => submitUrl()}
            name="addBookmark"
            className="flex w-full items-center space-x-2 rounded-md border border-transparent bg-slate-800 p-3 text-base font-medium text-white shadow transition duration-500 ease-in-out hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-white sm:px-4"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin text-white sm:mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg className="h-6 w-6 text-white sm:mr-1" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                />
              </svg>
            )}
            <span className="hidden font-serif sm:inline">Save</span>
          </button>
        </div>
      </div>
      {open && (
        <section className="rounded-md bg-slate-100 p-3 transition duration-500 ease-in-out">
          <div className="flex flex-col space-y-1">
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="category"
                className="text-xs font-semibold uppercase  text-slate-500"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full truncate rounded-md border-transparent pr-8 text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:opacity-75"
              />
            </div>
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="category"
                className="text-xs font-semibold uppercase  text-slate-500"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full truncate rounded-md border-transparent pr-8 text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:opacity-75"
              >
                {categories.map((category, i) => {
                  return (
                    <option defaultValue={i === 0} key={i}>
                      {category.name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="tags"
                className="text-xs font-semibold uppercase  text-slate-500"
              >
                Tags
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="block w-full truncate rounded-md border-transparent pr-8 text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:opacity-75"
              />
            </div>
            <div className="w-full overflow-hidden rounded-md px-2 transition focus-within:border-slate-200 focus-within:ring-0">
              <label
                htmlFor="description"
                className="text-xs font-semibold uppercase  text-slate-500"
              >
                Description
              </label>
              <textarea
                rows="3"
                id="description"
                placeholder=""
                value={desc}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-transparent bg-white text-sm transition focus:border-slate-200 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:opacity-75"
              ></textarea>
              <div className="flex items-center pb-[0.2rem] pt-3">
                <span className="rounded-lg bg-slate-200 px-2 py-1 text-[0.6rem] font-semibold uppercase text-slate-400">
                  Leave blank to use the default page title and description
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
