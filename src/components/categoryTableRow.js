import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToggle } from 'react-use'
import { useToast, toastTypes } from '@/lib/hooks'
import { useStore } from '@/lib/store'

export default function CategoryTableRow({ item }) {
  const { data: session } = useSession()
  const { id, name, description } = item
  const [editMode, toggleEditMode] = useToggle(false)
  const [categoryName, setCategoryName] = useState(name)
  const [categoryDesc, setCategoryDesc] = useState(description)
  const removeCategory = useStore((state) => state.removeCategory)
  const toast = useToast(5000)

  const deleteCategory = async () => {
    try {
      const delRes = await fetch('/api/categories', {
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
        removeCategory({ id })
        toast(toastTypes.SUCCESS, `Successfully deleted "${name}"`)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, `Error deleting "${name}"`)
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
      <th className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        <span className="font-normal">{id}</span>
      </th>
      <td className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        {!editMode ? (
          <span>{categoryName}</span>
        ) : (
          <input
            name="name"
            value={categoryName}
            type="text"
            onChange={(e) => setCategoryName(e.target.value)}
            className="block w-full rounded-lg border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
          />
        )}
      </td>
      <td className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        {!editMode ? (
          <span>{categoryDesc}</span>
        ) : (
          <input
            name="emoji"
            value={categoryDesc}
            type="text"
            onChange={(e) => setCategoryDesc(e.target.value)}
            className="block w-full rounded-lg border-2 border-slate-200 bg-slate-50 py-1 px-2 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500"
          />
        )}
      </td>
      <td className="flex items-center space-x-2 px-6 py-4 text-right">
        <button
          onClick={() => toggleEditMode()}
          className="font-medium text-slate-400 outline-none hover:underline focus:underline focus:underline-offset-2"
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
        <button
          onClick={() => deleteCategory()}
          className="font-medium text-rose-400 outline-none hover:underline focus:underline focus:underline-offset-2"
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
      </td>
    </tr>
  )
}
