import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'
import { useToggle } from 'react-use'

export default function TagTableRow({ item }) {
  const { data: session } = useSession()
  const { id, name, emoji, createdAt, _count } = item
  const count = _count?.bookmarks ?? 0
  const [editMode, toggleEditMode] = useToggle(false)
  const [tagName, setTagName] = useState(name)
  const [tagEmoji, setTagEmoji] = useState(emoji ?? '')
  const [loading, setLoading] = useState(false)
  const settings = useStore((state) => state.settings)
  const removeTag = useStore((state) => state.removeTag)
  const updateTag = useStore((state) => state.updateTag)
  const toast = useToast(5000)

  const deleteTag = async () => {
    setLoading(true)
    try {
      const delRes = await fetch('/api/tags', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: session?.user?.userId,
        }),
      })
      if (delRes.status === 200) {
        removeTag({ id })
        toast(toastTypes.SUCCESS, `Successfully deleted "${name}"`)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, `Error deleting "${name}"`)
      setLoading(false)
    }
  }

  const saveEdit = async () => {
    try {
      if (tagName.length > 190 || tagEmoji.length > 190) {
        toast(toastTypes.WARNING, 'Name or emoji too long')
        return
      }
      const editRes = await fetch('/api/tags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          userId: session?.user?.userId,
          name: tagName,
          emoji: tagEmoji,
        }),
      })
      if (editRes.status === 200) {
        updateTag(id, {
          name: tagName,
          emoji: tagEmoji,
        })
        toggleEditMode()
        toast(toastTypes.SUCCESS, `Successfully edited "${name}"`)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, `Error editing "${name}"`)
    }
  }

  return (
    <tr className="bg-white even:bg-gray-50 hover:bg-slate-100">
      <td className="w-4 p-4">
        <div className="flex items-center">
          <input
            id="checkbox-table-1"
            type="checkbox"
            className={`h-4 w-4 rounded border-slate-300 bg-slate-100 text-slate-600 focus:ring-2 focus:ring-slate-500 `}
          />
          <label htmlFor="checkbox-table-1" className="sr-only">
            checkbox
          </label>
        </div>
      </td>
      <th className={`px-6 ${editMode ? 'py-5' : 'py-4'}`}>
        <span className="font-normal">{id}</span>
      </th>
      <th className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        <span className="font-normal">{count ?? 0}</span>
      </th>
      <td className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        {!editMode ? (
          <span>{tagName}</span>
        ) : (
          <input
            name="name"
            value={tagName}
            type="text"
            onChange={(e) => setTagName(e.target.value)}
            className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
          />
        )}
      </td>
      <td className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        {!editMode ? (
          <span className="text-xl">{tagEmoji}</span>
        ) : (
          <input
            name="emoji"
            value={tagEmoji}
            type="text"
            onChange={(e) => setTagEmoji(e.target.value)}
            className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 py-1 px-2 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500 text-xl"
          />
        )}
      </td>
      <th className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        <span className="font-normal">
          {createdAt ? new Date(createdAt).toLocaleString(settings.locale) : ''}
        </span>
      </th>
      <td
        className={`flex justify-center items-center space-x-2 ${
          editMode ? 'px-2' : 'px-6'
        } py-4 text-right`}
      >
        {!editMode ? (
          <button
            onClick={() => toggleEditMode()}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        ) : (
          <>
            <button
              onClick={() => toggleEditMode()}
              className="font-medium text-rose-400 outline-none"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              onClick={() => saveEdit()}
              className="font-medium text-emerald-500 outline-none"
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
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
            </button>
          </>
        )}
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
            onClick={() => deleteTag()}
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
