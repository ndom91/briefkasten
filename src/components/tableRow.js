import { useState } from 'react'
import { useToggle } from 'react-use'

export default function TableRow({ tag }) {
  const { id, name, emoji } = tag
  const [editMode, toggleEditMode] = useToggle(false)
  const [tagName, setTagName] = useState(name)
  const [tagEmoji, setTagEmoji] = useState(emoji)

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
          <span>{tagName}</span>
        ) : (
          <input
            name="name"
            value={tagName}
            type="text"
            onChange={(e) => setTagName(e.target.value)}
            className="block w-2/3 rounded-lg border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
          />
        )}
      </td>
      <td className={`px-6 ${editMode ? 'py-2' : 'py-4'}`}>
        {!editMode ? (
          <span>{tagEmoji}</span>
        ) : (
          <input
            name="emoji"
            value={tagEmoji}
            type="text"
            onChange={(e) => setTagEmoji(e.target.value)}
            className="block w-2/3 rounded-lg border-2 border-slate-200 bg-slate-50 py-1 px-2 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500"
          />
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => toggleEditMode()}
          className="font-medium text-slate-600 outline-none hover:underline focus:underline focus:underline-offset-2"
        >
          Edit
        </button>
      </td>
    </tr>
  )
}
