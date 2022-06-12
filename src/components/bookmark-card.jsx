import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToggle } from 'react-use'
import { asyncFileReader } from '@/lib/helpers'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'
import Chip from '@/components/chip'

export default function BookmarkCard({ bookmark, categories }) {
  const { id, title, url, desc, category, tags, createdAt, image } = bookmark

  const { data: session } = useSession()

  const removeBookmark = useStore((state) => state.removeBookmark)
  const updateBookmark = useStore((state) => state.updateBookmark)
  const settings = useStore((state) => state.settings)

  const [imageUrl, setImageUrl] = useState(
    image ?? 'https://source.unsplash.com/random/300x201'
  )
  const [loadingDel, setLoadingDel] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [editCategory, setEditCategory] = useState(category?.name ?? '')
  const [editTitle, setEditTitle] = useState(title)
  const [editUrl, setEditUrl] = useState(url)
  const [editDesc, setEditDesc] = useState(desc)
  const [editMode, toggleEditMode] = useToggle(false)
  const toast = useToast(5000)

  const saveEdit = async () => {
    try {
      setLoadingSave(true)
      const updateRes = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: session.user.userId,
          title: editTitle,
          url: editUrl,
          desc: editDesc,
          category: editCategory,
          tags: tags.map((tag) => tag.id),
        }),
      })
      if (updateRes.status === 200) {
        updateBookmark({
          id,
          title: editTitle,
          url: editUrl,
          desc: editDesc,
          category: editCategory,
          tags,
        })
        toast(toastTypes.SUCCESS, `Successfully edited "${editTitle}"`)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, 'Error editing bookmark', error.message)
    }
    setLoadingSave(false)
    toggleEditMode()
  }

  const handleDelete = async () => {
    try {
      setLoadingDel(true)
      let imageFileName = null
      if (imageUrl.includes('ik.imagekit.io')) {
        const imageUrlPathname = new URL(imageUrl).pathname
        imageFileName = imageUrlPathname.substring(
          imageUrlPathname.lastIndexOf('/') + 1
        )
      }
      const deleteRes = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: session.user.userId,
          tags: tags.map((tag) => tag.id),
          imageFileName,
        }),
      })
      if (deleteRes.status === 200) {
        removeBookmark({ id })
        toast(toastTypes.SUCCESS, `Successfully deleted "${editTitle}"`)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, 'Error deleting bookmark', error.message)
    }
    setLoadingDel(false)
  }

  async function fetchFallbackImage(url) {
    try {
      const res = await fetch(
        `/api/bookmarks/image?url=${encodeURIComponent(url)}`
      )
      const data = await res.blob()
      const dataUrl = await asyncFileReader(data)
      const uploadRes = await fetch(
        `/api/bookmarks/uploadImage?fileName=${new URL(url).hostname}&id=${id}`,
        {
          method: 'PUT',
          body: dataUrl,
        }
      )
      const uploadData = await uploadRes.json()
      setImageUrl(uploadData.url)
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, 'Error fetching fallback image', error.message)
      setImageUrl('https://source.unsplash.com/random/300x201')
    }
  }

  return (
    <>
      <div
        suppressHydrationWarning={true}
        className="group relative flex w-72 flex-col overflow-hidden rounded-md border-2 border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-lg"
      >
        <div className="absolute top-3 right-3 z-10 flex flex-row-reverse gap-2 rounded-lg border-0 border-slate-400/50  bg-slate-600/90 px-3 py-2 opacity-0 shadow-md transition group-hover:opacity-100">
          {editMode ? (
            loadingSave ? (
              <svg
                className="h-5 w-5 animate-spin text-white"
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
                onClick={() => saveEdit()}
                className="font-medium text-emerald-400 outline-none transition hover:text-emerald-600"
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </button>
            )
          ) : (
            <button
              name="edit"
              tabIndex={-1}
              onClick={toggleEditMode}
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
          )}
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
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-md outline-none"
          >
            {/* eslint-disable @next/next/no-img-element */}
            <img
              className="aspect-2 max-h-[125px] rounded-md border-2 border-slate-50 object-cover object-left-top transition group-focus:ring-4 group-focus:ring-slate-200"
              src={imageUrl}
              onError={() => fetchFallbackImage(url)}
              alt={`${editUrl} Image`}
            />
          </a>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-1 text-sm text-slate-400">
              <time dateTime="2020-03-10" className="">
                {new Date(createdAt).toLocaleDateString(settings.locale, {
                  dateStyle: 'short',
                })}
              </time>
              {editCategory && (
                <>
                  <span aria-hidden="true"> · </span>
                  {!editMode && (
                    <span className="font-bold">{editCategory}</span>
                  )}
                </>
              )}
              {editMode ? (
                <select
                  name="category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-sm border-2 border-slate-200 bg-white px-1 py-0 text-xs outline-none focus:border-slate-100 focus:ring-2 focus:ring-slate-300"
                >
                  <option value="" defaultChecked />
                  {categories?.map((cat) => (
                    <option value={cat.name} key={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
            <section className="block space-y-2">
              {editMode ? (
                <input
                  type="text"
                  name="title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="my-1 w-full rounded-sm border-2 border-slate-200 bg-white px-1 py-0 outline-none focus:border-slate-100 focus:ring-2 focus:ring-slate-300"
                />
              ) : (
                <a
                  href={editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block space-y-2 rounded-sm outline-none transition focus:ring-2 focus:ring-slate-200"
                >
                  <h3 className="text-xl font-semibold leading-none tracking-tighter text-neutral-600 line-clamp-1">
                    {editTitle}
                  </h3>
                </a>
              )}
              {editMode ? (
                <input
                  type="url"
                  name="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="!mt-0.5 w-full rounded-sm border-2 border-slate-200 bg-white px-1 py-0 text-xs outline-none focus:border-slate-100 focus:ring-2 focus:ring-slate-300"
                />
              ) : (
                <a
                  href={editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm text-xs text-slate-300 outline-none transition line-clamp-1 focus:ring-2 focus:ring-slate-200"
                >
                  {editUrl}
                </a>
              )}
              {editMode ? (
                <textarea
                  rows="3"
                  name="desc"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-sm border-2 border-slate-200 bg-white px-1 py-0 text-xs outline-none focus:border-slate-100 focus:ring-2 focus:ring-slate-300"
                />
              ) : null}
              {!editMode && editDesc && (
                <p className="text-sm font-normal text-gray-500 line-clamp-3">
                  {editDesc}
                </p>
              )}
              {tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Chip key={tag.id} name={tag.name} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
