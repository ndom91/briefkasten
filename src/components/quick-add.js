import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function QuickAdd() {
  const [url, setUrl] = useState('')
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
    <div className="flex">
      <div className="min-w-0 flex-1">
        <input
          type="url"
          className="block w-full transform rounded-md border border-transparent bg-gray-100 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
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
          className="block w-full rounded-lg border border-transparent bg-slate-400 px-5 py-3 text-base font-medium text-white shadow transition hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 sm:px-10"
        >
          Add
        </button>
      </div>
    </div>
  )
}
