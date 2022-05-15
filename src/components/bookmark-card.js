import { useToggle } from 'react-use'
import { useSession } from 'next-auth/react'

export default function BookmarkCard({ bookmark, categories }) {
  const { data: session } = useSession()
  const [on, toggle] = useToggle(false)
  const { id, title, url, description, category, tags } = bookmark

  async function handleDelete() {
    try {
      if (!session?.user?.userId) {
        console.error('No userId available')
        return
      }
      await fetch('/api/bookmarks/', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div
      className="relative h-fit max-w-[250px] overflow-hidden rounded shadow-lg"
      key={id}
    >
      <button
        onClick={() => toggle()}
        name="edit"
        className="absolute top-3 right-3 text-slate-500 outline-none transition hover:text-slate-800 hover:outline-none focus:text-slate-800"
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
      {on && (
        <button
          name="delete"
          onClick={handleDelete}
          className="absolute top-10 right-3 text-rose-300 outline-none animate-in slide-in-from-top hover:text-rose-800 hover:outline-none"
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
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{title}</div>
        <div className="mb-2 truncate text-sm font-light">{url}</div>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-base text-gray-700">{category?.name}</p>
      </div>
      {tags.length > 0 ? (
        <div className="px-6 pt-2 pb-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : (
        <div />
      )}
    </div>
  )
}
