import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'

// Favicon API's
// https://icon.horse/usage
// https://icons.duckduckgo.com/ip3/dev.to.ico
// https://www.google.com/s2/favicons?domain=${domain}&sz=${size}
// https://favicongrabber.com/
// https://faviconkit.com

export default function BookmarkTableRow({ item, toggleSidebar }) {
  const { data: session } = useSession()
  const { id, title, url, desc, category, tags, createdAt, image } = item
  const [loading, setLoading] = useState(false)
  const settings = useStore((state) => state.settings)
  const removeBookmark = useStore((state) => state.removeTag)
  const toast = useToast(5000)

  const deleteBookmark = async () => {
    setLoading(true)
    try {
      const imageUrlPathname = new URL(image).pathname
      const imageFileName = imageUrlPathname.substring(
        imageUrlPathname.lastIndexOf('/') + 1
      )
      const delRes = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: session?.user?.userId,
          imageFileName,
        }),
      })
      if (delRes.status === 200) {
        removeBookmark(id)
        toast(toastTypes.SUCCESS, 'Successfully deleted', title)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, 'Error deleting', title)
      setLoading(false)
    }
  }

  return (
    <tr className="bg-white even:bg-gray-50 hover:bg-slate-100">
      <td className="pl-4">
        <div className="flex items-center justify-center">
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src={`https://icon.horse/icon/${new URL(url).hostname}`}
            alt={title}
            className="h-8 w-8 rounded object-cover"
          />
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-ellipsis break-all line-clamp-2">{title}</span>
      </td>
      <td className="max-w-[8rem] px-6 py-4">
        <span className="text-ellipsis break-all line-clamp-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition hover:text-black"
          >
            {url}
          </a>
        </span>
      </td>
      <td className="max-w-[8rem] px-6 py-4">
        <span className="text-ellipsis break-all line-clamp-3">{desc}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-ellipsis break-all">{category?.name ?? ''}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-ellipsis break-all">
          {tags.map((tag) => tag.name).join(', ')}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-ellipsis break-all" suppressHydrationWarning>
          {new Date(createdAt).toLocaleString(settings.locale)}
        </span>
      </td>
      <td className="flex items-center justify-center space-x-2 px-6 py-4 text-right">
        <button
          onClick={() => toggleSidebar()}
          className="font-medium text-slate-400 outline-none "
        >
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
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        {loading ? (
          <svg
            className="-ml-1 h-5 w-5 animate-spin text-slate-500"
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
          <button
            onClick={() => deleteBookmark()}
            className="font-medium text-rose-400 outline-none "
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </td>
    </tr>
  )
}
