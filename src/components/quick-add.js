import { useState } from 'react'

export default function QuickAdd() {
  const [url, setUrl] = useState('')

  const submitUrl = async () => {
    console.log('URL', url)
  }

  return (
    <div className="flex">
      <div className="min-w-0 flex-1">
        <input
          type="url"
          className="block w-full transform rounded-md border border-transparent bg-gray-100 px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
          placeholder="https://"
          value={url}
          onChange={(value) => setUrl(value)}
        />
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-3">
        <button
          type="submit"
          onClick={() => submitUrl()}
          name="addBookmark"
          className="block w-full rounded-lg border border-transparent bg-slate-400 px-5 py-3 text-base font-medium text-white shadow transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 sm:px-10"
        >
          Add
        </button>
      </div>
    </div>
  )
}
