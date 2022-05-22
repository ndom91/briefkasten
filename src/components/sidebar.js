import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast, toastTypes } from '@/lib/hooks'
import { useStore } from '@/lib/store'

const types = {
  CATEGORY: 'category',
  TAG: 'tag',
}

export default function Sidebar() {
  const { data: session } = useSession()
  const categories = useStore((state) => state.categories)
  const tags = useStore((state) => state.tags)
  const setCategoryFilter = useStore((state) => state.setCategoryFilter)
  const setTagFilter = useStore((state) => state.setTagFilter)
  const categoryFilter = useStore((state) => state.categoryFilter)
  const tagFilter = useStore((state) => state.tagFilter)
  const addCategory = useStore((state) => state.addCategory)
  const addTag = useStore((state) => state.addTag)
  const [quickAdd, setQuickAdd] = useState('')
  const [quickAddCategory, setQuickAddCategory] = useState('')
  const [quickAddTag, setQuickAddTag] = useState('')
  const toast = useToast(5000)

  const toggleQuickAdd = (type) => {
    if (type === types.CATEGORY) {
      setQuickAdd(types.CATEGORY)
    } else if (type === types.TAG) {
      setQuickAdd(types.TAG)
    } else {
      setQuickAdd('')
    }
  }

  const saveQuickCategory = async () => {
    try {
      const saveRes = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.userId,
          name: quickAddCategory,
        }),
      })
      if (saveRes.status === 200) {
        const saveData = await saveRes.json()
        addCategory({ id: saveData.data.id, name: quickAddCategory })
        setQuickAddCategory('')
        toggleQuickAdd('')
        toast(toastTypes.SUCCESS, 'Successfully Saved Category')
      }
    } catch (error) {
      toast(toastTypes.ERROR, 'Error Saving Category')
    }
  }

  const saveQuickTag = async () => {
    try {
      const saveRes = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.userId,
          name: quickAddTag,
        }),
      })
      if (saveRes.status === 200) {
        const saveData = await saveRes.json()
        addTag({ id: saveData.data.id, name: quickAddTag })
        setQuickAddTag('')
        toggleQuickAdd('')
        toast(toastTypes.SUCCESS, 'Successfully Saved Tag')
      }
    } catch (error) {
      toast(toastTypes.ERROR, 'Error Saving Tag')
    }
  }

  const applyCategoryFilter = (id) => {
    if (id === categoryFilter) {
      setCategoryFilter('')
      return
    }
    setCategoryFilter(id)
  }

  const applyTagFilter = (id) => {
    if (id === tagFilter) {
      setTagFilter('')
      return
    }
    setTagFilter(id)
  }

  return (
    <aside className="mx-4 flex flex-col space-y-4 rounded-lg bg-slate-50 p-6">
      <div className="flex flex-1 flex-col space-y-6">
        <div>
          <Link href="/">
            <div className="flex items-center justify-start space-x-2 hover:cursor-pointer">
              <svg
                className="h-6 w-6 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-lg text-slate-600">Home</span>
            </div>
          </Link>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-start space-x-2">
            <svg
              className="h-6 w-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-lg text-slate-600">Categories</h2>
            <div className="flex flex-1 justify-end hover:cursor-pointer">
              <svg
                className="h-6 w-6 text-slate-300"
                onClick={() => toggleQuickAdd('category')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4 flex flex-col items-start space-y-2">
            {categories?.map((cat) => (
              <button
                onClick={() => applyCategoryFilter(cat.id)}
                key={cat.id}
                className={`inline-block text-left text-slate-400 ${
                  categoryFilter === cat.id && 'font-extrabold'
                }`}
              >
                {cat.name}
              </button>
            ))}
            {quickAdd === types.CATEGORY && (
              <div className="flex items-center justify-start space-x-1">
                <input
                  name="addCategory"
                  value={quickAddCategory}
                  type="text"
                  onChange={(e) => setQuickAddCategory(e.target.value)}
                  className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
                />
                <button
                  onClick={saveQuickCategory}
                  className="grid place-items-center rounded-md p-1 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <svg className="h-6 w-6 text-slate-600" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    toggleQuickAdd('')
                    setQuickAddCategory('')
                  }}
                  className="grid place-items-center rounded-md p-1 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <svg
                    className="h-6 w-6 text-rose-400"
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
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-start space-x-2">
            <svg
              className="h-6 w-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h2 className="text-lg text-slate-600">Tags</h2>
            <div className="flex flex-1 justify-end hover:cursor-pointer">
              <svg
                className="h-6 w-6 text-slate-300"
                onClick={() => toggleQuickAdd('tag')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
          <div className="ml-4 flex flex-col space-y-2">
            {tags?.map((tag) => (
              <button
                onClick={() => applyTagFilter(tag.id)}
                key={tag.id}
                className={`inline-block text-left text-slate-400 ${
                  tagFilter === tag.id && 'font-extrabold'
                }`}
              >
                {tag.emoji} {tag.name}
              </button>
            ))}
            {quickAdd === types.TAG && (
              <div className="flex items-center justify-start space-x-1">
                <input
                  name="addCategory"
                  value={quickAddTag}
                  type="text"
                  onChange={(e) => setQuickAddTag(e.target.value)}
                  className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
                />
                <button
                  onClick={saveQuickTag}
                  className="grid place-items-center rounded-md p-1 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <svg className="h-6 w-6 text-slate-600" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    toggleQuickAdd('')
                    setQuickAddTag('')
                  }}
                  className="grid place-items-center rounded-md p-1 outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <svg
                    className="h-6 w-6 text-rose-400"
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
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-sm italic tracking-tight text-slate-300">
        Click to filter the view of saved bookmarks
      </p>
    </aside>
  )
}
