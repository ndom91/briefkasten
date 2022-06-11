import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useKeyPress } from 'react-use'
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
  const searchText = useStore((state) => state.searchText)
  const setSearchText = useStore((state) => state.setSearchText)

  const [searchFocused, setSearchFocused] = useState(false)
  const [quickAdd, setQuickAdd] = useState('')
  const [quickAddCategory, setQuickAddCategory] = useState('')
  const [quickAddTag, setQuickAddTag] = useState('')

  const toast = useToast(5000)
  const searchRef = useRef()
  const quickAddTagRef = useRef()
  const quickAddCategoryRef = useRef()
  const router = useRouter()

  useKeyPress((e) => {
    if (e.type === 'keydown') {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        searchRef?.current?.focus()
      }
    }
  })

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
    if (router.pathname !== '/') return
    if (id === categoryFilter) {
      setCategoryFilter('')
      return
    }
    setCategoryFilter(id)
  }

  const applyTagFilter = (id) => {
    if (router.pathname !== '/') return
    if (id === tagFilter) {
      setTagFilter('')
      return
    }
    setTagFilter(id)
  }

  return (
    <aside className="flex flex-shrink-0 shadow-r-lg">
      <div className="flex flex-col w-64">
        <div className="rounded-r-md flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-slate-800">
          <div className="flex flex-col items-center flex-shrink-0 px-4">
            <Link href="/" passHref>
              <div className="flex items-center hover:cursor-pointer ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-10 w-10 rounded-full bg-slate-700 p-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="text-slate-200 ml-3 font-serif text-xl font-semibold">
                  Briefkasten
                </span>
              </div>
            </Link>
            <button className="hidden rounded-lg focus:outline-none focus:shadow-outline">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1 bg-slate-800">
              <ul>
                <li>
                  <div className="relative flex w-full items-center justify-start">
                    <svg
                      className="pointer-events-none absolute left-2 top-2 h-5 w-5 text-slate-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {!searchFocused && searchText.length === 0 ? (
                      <div className="pointer-events-none absolute left-8 top-[0.65rem] z-10 hidden text-xs text-slate-400 opacity-50 lg:inline-block">
                        <span className="rounded-md bg-slate-200 p-1 px-2 ">
                          <kbd className="">ctrl</kbd>
                          <span> + </span>
                          <kbd className="">k</kbd>
                        </span>
                        <span> to search</span>
                      </div>
                    ) : null}
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchText}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full rounded-md border-2 border-slate-200 py-1 px-2 pl-8 pr-8 text-base text-slate-600 outline-none placeholder:text-slate-200 focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent"
                    />
                    {searchText.length ? (
                      <svg
                        className="absolute right-1.5 top-1.5 h-6 w-6 text-rose-300 hover:cursor-pointer"
                        onClick={() => setSearchText('')}
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
                    ) : null}
                  </div>
                </li>
                <li>
                  <Link href="/">
                    <div className="inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform border rounded-lg text-slate-200 bg-slate-900 border-slate-900 focus:shadow-outline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                      <span className="ml-4"> Home</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className="inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform border rounded-lg text-neutral-200 border-slate-800 hover:border-slate-800 focus:shadow-outline hover:bg-slate-900"
                    href="/settings"
                  >
                    <div className="inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform border rounded-lg text-slate-200 bg-slate-900 border-slate-900 focus:shadow-outline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span className="ml-4">Settings</span>
                    </div>
                  </Link>
                </li>
              </ul>
              <div className="px-4 pt-4 font-medium text-neutral-200 mb-2 flex items-center justify-start space-x-2">
                <h2 className="font-serif text-lg text-slate-200">Category</h2>
                <div className="hidden flex-1 justify-end hover:cursor-pointer lg:flex">
                  <button
                    className="focus:(ring-2,ring-slate-200) rounded-md outline-none"
                    onClick={() => {
                      toggleQuickAdd('category')
                      setTimeout(() => {
                        quickAddCategoryRef.current.focus()
                      }, 0)
                    }}
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <ul>
                <div className="ml-2 flex flex-col items-start space-y-2 md:ml-4">
                  {categories?.map((cat) => (
                    <button
                      onClick={() => applyCategoryFilter(cat.id)}
                      key={cat.id}
                      className={`focus:(ring-2,ring-slate-200) inline-block rounded-md px-1 text-left font-serif text-slate-400 outline-none ${
                        categoryFilter === cat.id && 'font-extrabold'
                      }`}
                    >
                      {cat.name}
                      <span className="bg-slate-200 rounded-md px-1 text-center ml-2">
                        {cat['_count']?.bookmarks ?? 0}
                      </span>
                    </button>
                  ))}
                  {quickAdd === types.CATEGORY && (
                    <div className="flex items-center justify-start space-x-1">
                      <input
                        name="addCategory"
                        value={quickAddCategory}
                        ref={quickAddCategoryRef}
                        type="text"
                        onChange={(e) => setQuickAddCategory(e.target.value)}
                        className="block w-full rounded-md border-2 border-slate-200 bg-white p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-300 focus:ring-slate-300"
                      />
                      <button
                        onClick={saveQuickCategory}
                        className="grid place-items-center rounded-md p-1 outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        <svg
                          className="h-6 w-6 text-slate-500"
                          viewBox="0 0 24 24"
                        >
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
              </ul>
              <div className="px-4 pt-4 font-medium text-neutral-200 mb-2 flex items-center uppercase justify-start space-x-2">
                <h2 className="font-serif text-lg text-slate-200">Tag</h2>
                <div className="hidden flex-1 justify-end hover:cursor-pointer lg:flex">
                  <button
                    className="rounded-md outline-none focus:ring-2 focus:ring-slate-200"
                    onClick={() => {
                      toggleQuickAdd('tag')
                      setTimeout(() => {
                        quickAddTagRef.current.focus()
                      }, 0)
                    }}
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <ul>
                <div className="ml-2 flex flex-col items-start space-y-2 md:ml-4">
                  {tags?.map((tag) => (
                    <button
                      onClick={() => applyTagFilter(tag.id)}
                      key={tag.id}
                      className={`inline-block rounded-md px-1 text-left font-serif text-slate-400 outline-none focus:ring-2 focus:ring-slate-200 ${
                        tagFilter === tag.id && 'font-extrabold'
                      }`}
                    >
                      {tag.emoji} <span className="ml-1">{tag.name}</span>{' '}
                      <span className="bg-slate-200 rounded-md px-1 text-center ml-1">
                        {tag['_count']?.bookmarks ?? 0}
                      </span>
                    </button>
                  ))}
                  {quickAdd === types.TAG && (
                    <div className="flex items-center justify-start space-x-1">
                      <input
                        name="addTag"
                        value={quickAddTag}
                        ref={quickAddTagRef}
                        type="text"
                        onChange={(e) => setQuickAddTag(e.target.value)}
                        className="block w-full rounded-md border-2 border-slate-200 bg-white p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-300 focus:ring-slate-300"
                      />
                      <button
                        onClick={saveQuickTag}
                        className="grid place-items-center rounded-md p-1 outline-none focus:ring-2 focus:ring-slate-200"
                      >
                        <svg
                          className="h-6 w-6 text-slate-600"
                          viewBox="0 0 24 24"
                        >
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
              </ul>
            </nav>
          </div>
          <div className="flex flex-shrink-0 p-4 px-4 bg-slate-900">
            <a href="#" className="flex-shrink-0 block w-full group">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block rounded-full h-9 w-9"
                    src={session?.user?.image}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-200">
                    {session?.user?.name}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </aside>
  )
}
