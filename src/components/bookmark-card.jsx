import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'
import Chip from '@/components/chip'

const fallbackRandomImage = `https://picsum.photos/250/125?random=${Math.floor(
  Math.random() * 1000
)}`

export default function BookmarkCard({ bookmark, toggleSidebar, session }) {
  const { id, title, url, desc, category, tags, createdAt, image } = bookmark

  const settings = useStore((state) => state.settings)
  const removeBookmark = useStore((state) => state.removeBookmark)

  const toast = useToast(5000)
  const [loadingDel, setLoadingDel] = useState(false)
  const [imageUrl, setImageUrl] = useState(image ?? fallbackRandomImage)

  const handleDelete = async () => {
    try {
      setLoadingDel(true)
      const imageUrlPathname = new URL(imageUrl).pathname
      const imageFileName = imageUrlPathname.substring(
        imageUrlPathname.lastIndexOf('/') + 1
      )
      const deleteRes = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: session.user.userId,
          imageFileName,
        }),
      })
      if (deleteRes.status === 200) {
        removeBookmark(id)
        toast(toastTypes.SUCCESS, 'Successfully deleted', title)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, 'Error deleting bookmark', error.message)
    }
    setLoadingDel(false)
  }

  function fetchFallbackImage() {
    setImageUrl(fallbackRandomImage)
  }

  return (
    <div className="bookmark-card group relative flex flex-col rounded-md border-2 border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-lg">
      <div className="absolute top-3 right-3 z-10 flex flex-row-reverse gap-2 rounded-lg border-0 border-slate-400/50  bg-slate-600/90 px-3 py-2 opacity-0 shadow-md transition group-hover:opacity-100">
        <button
          name="edit"
          tabIndex={-1}
          onClick={toggleSidebar}
          className="text-slate-300 outline-none transition hover:text-slate-400 hover:outline-none focus:text-slate-400"
        >
          <svg
            className="h-5 w-5"
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
        {loadingDel ? (
          <svg
            className="-ml-1 h-5 w-5 animate-spin text-white"
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
            name="delete"
            onClick={handleDelete}
            tabIndex={-1}
            className="text-rose-400 opacity-0 outline-none transition animate-in slide-in-from-top hover:text-rose-600 hover:outline-none group-hover:opacity-100"
          >
            <svg
              className="h-5 w-5"
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
      </div>
      <div className="mb-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-md outline-none"
        >
          <img
            className="aspect-2 w-[485px] rounded-md border-2 border-slate-50 object-cover object-left-top transition group-focus:ring-4 group-focus:ring-slate-200"
            src={`/api/imageProxy?url=${encodeURIComponent(imageUrl)}`}
            fetchpriority="high"
            onError={fetchFallbackImage}
            alt={`${title} Image`}
          />
        </a>
      </div>
      <div className="flex w-full flex-1 flex-col justify-between space-y-2">
        <div className="flex items-center space-x-1 text-sm text-slate-400">
          <time dateTime={createdAt} title={createdAt} className="">
            {new Date(createdAt).toLocaleDateString(settings.locale, {
              dateStyle: 'short',
            })}
          </time>
          {category && (
            <>
              <span aria-hidden="true"> · </span>
              <span className="font-bold">{category.name}</span>
            </>
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block max-w-full space-y-2 rounded-sm outline-none transition focus:ring-2 focus:ring-slate-200"
        >
          <h3 className="w-full text-xl font-semibold leading-none tracking-tighter text-neutral-600 line-clamp-1">
            {title}
          </h3>
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all rounded-sm text-xs text-slate-300 outline-none transition line-clamp-1 focus:ring-2 focus:ring-slate-200"
        >
          {url}
        </a>
        {desc && (
          <p className="w-full max-w-full text-sm font-normal text-gray-500 line-clamp-3">
            {desc}
          </p>
        )}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Chip key={tag.id} name={`${tag.emoji ?? ''} ${tag.name}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
