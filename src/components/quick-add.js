import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToggle } from 'react-use'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'
// import Chip from '@/components/chip'

export default function QuickAdd({ categories }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [desc, setDescription] = useState('')
  const [open, toggleOpen] = useToggle(false)
  const { data: session } = useSession()
  const addBookmark = useStore((state) => state.addBookmark)
  const toast = useToast(5000)

  async function submitUrl() {
    try {
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
        toast(toastTypes.SUCCESS, `Successfully added ${new URL(url).hostname}`)
        const data = await res.json()

        // Add new Bookmark to UI
        addBookmark({
          url,
          createdAt: data.createdAt,
          id: data.id,
          desc: data.desc,
          image: data.image,
          title: data.title,
        })

        // Empty fields and toggle closed
        setUrl('')
        setTitle('')
        setCategory('')
        setTags('')
        setDescription('')
        open && toggleOpen()
      }
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
            className="flex w-10 items-center justify-center rounded-l-md border-transparent bg-slate-100 px-2 outline-none transition focus-within:z-10 focus-within:ring-2 focus-within:ring-slate-200 focus-within:ring-offset-2 focus-within:ring-offset-white focus:outline-none"
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
            className="block flex-1 transform rounded-r-md border border-transparent bg-slate-100 py-3 pl-2 pr-5 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:z-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white"
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
        <section className="rounded-md bg-slate-100 p-3 transition duration-500 ease-in-out">
          <div className="flex flex-col space-y-1">
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="category"
                className="text-xs font-medium uppercase tracking-tight text-slate-500"
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
                className="text-xs font-medium uppercase tracking-tight text-slate-500"
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
                      {category.name} - {category.description}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="w-full space-y-0.5 px-2">
              <label
                htmlFor="tags"
                className="text-xs font-medium uppercase tracking-tight text-slate-500"
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
                className="text-xs font-medium uppercase tracking-tight text-slate-500"
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
                <span className="rounded-lg bg-slate-200 px-2 py-1 text-[0.6rem] uppercase text-slate-400">
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
