import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToggle } from "react-use"
import { useToast, toastTypes } from "@/lib/hooks"
import { useStore } from "@/lib/store"

export default function CategoryTableRow({ item }) {
  const { data: session } = useSession()
  const { id, name, description, createdAt, _count } = item
  const count = _count?.bookmarks ?? 0
  const [editMode, toggleEditMode] = useToggle(false)
  const [categoryName, setCategoryName] = useState(name)
  const [categoryDesc, setCategoryDesc] = useState(description)
  const [loading, setLoading] = useState(false)
  const removeCategory = useStore((state) => state.removeCategory)
  const updateCategory = useStore((state) => state.updateCategory)
  const settings = useStore((state) => state.settings)
  const toast = useToast(5000)

  const deleteCategory = async () => {
    try {
      setLoading(true)
      const delRes = await fetch("/api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          userId: session?.user?.userId,
        }),
      })
      if (delRes.status === 200) {
        removeCategory(id)
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
      if (categoryName.length > 190 || categoryDesc.length > 190) {
        toast(toastTypes.WARNING, "Category or name too long")
        return
      }
      const editRes = await fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          userId: session?.user?.userId,
          name: categoryName,
          description: categoryDesc,
        }),
      })
      if (editRes.status === 200) {
        updateCategory(id, {
          name: categoryName,
          description: categoryDesc,
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
      <th className={`px-6 ${editMode ? "py-2" : "py-4"}`}>
        <span className="font-normal">{id}</span>
      </th>
      <th className="px-6 py-4">
        <span className="font-normal">{count ?? 0}</span>
      </th>
      <td className={`px-6 ${editMode ? "py-2" : "py-4"}`}>
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
      <td className={`px-6 ${editMode ? "py-2" : "py-4"}`}>
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
      <th className={`px-6 ${editMode ? "py-2" : "py-4"}`}>
        <span className="font-normal" suppressHydrationWarning>
          {createdAt ? new Date(createdAt).toLocaleString(settings.locale) : ""}
        </span>
      </th>
      <td
        className={`flex items-center justify-center space-x-2 ${
          editMode ? "px-0" : "px-6"
        } py-4 text-right`}
      >
        {!editMode ? (
          <>
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
            <button
              onClick={() => deleteCategory()}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </>
        ) : (
          <>
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
        ) : null}
      </td>
    </tr>
  )
}
