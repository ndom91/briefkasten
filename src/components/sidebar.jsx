import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import { useToggle, useLocalStorage } from 'react-use'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useState, useRef, forwardRef, Fragment } from 'react'
import { useToast, toastTypes } from '@/lib/hooks'
import { useStore } from '@/lib/store'

const types = {
  CATEGORY: 'category',
  TAG: 'tag',
}

const NextLink = forwardRef((props, ref) => {
  let { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})

NextLink.displayName = 'NextLink'

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

  const [value, setValue, remove] = useLocalStorage(
    'dashboard.sidebarOpen',
    true
  )

  const [quickAdd, setQuickAdd] = useState('')
  const [quickAddCategory, setQuickAddCategory] = useState('')
  const [quickAddTag, setQuickAddTag] = useState('')
  const [open, toggleOpen] = useToggle(value)
  const [openCategory, toggleOpenCategory] = useToggle(false)
  const [openTag, toggleOpenTag] = useToggle(false)

  const toast = useToast(5000)
  const quickAddTagRef = useRef()
  const quickAddCategoryRef = useRef()
  const router = useRouter()

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
    <aside
      suppressHydrationWarning={true}
      className={`flex-shrink-0 drop-shadow-md max-h-screen w-full ${
        open ? 'max-w-[16rem]' : 'max-w-[6rem]'
      } rounded-r-md flex flex-col flex-grow pt-5 border-r bg-slate-800 transition`}
    >
      <div className="flex items-center justify-center px-4">
        <Link href="/">
          <div
            className="flex items-center hover:cursor-pointer"
            suppressHydrationWarning={true}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              aria-hidden="true"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-10 w-10 rounded-full bg-slate-700 p-2 text-white"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            {open && (
              <span className="text-slate-200 ml-3 font-serif text-xl font-semibold">
                Briefkasten
              </span>
            )}
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
      <div
        className={`flex flex-col flex-grow px-4 mt-5 bg-slate-800 ${
          open && 'overflow-y-scroll'
        }`}
      >
        <ul>
          <li>
            <NextLink
              href="/"
              className="inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-slate-200 hover:bg-slate-900 focus:shadow-outline hover:cursor-pointer focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-900 outline-none focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${open ? 'w-4 h-4' : 'w-7 h-7'}`}
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
              <span
                className={`font-serif text-lg text-slate-200 ml-4 ${
                  !open && 'hidden'
                }`}
              >
                {' '}
                Home
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink
              href="/categories"
              className="inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-slate-200 hover:bg-slate-900 focus:shadow-outline hover:cursor-pointer focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-900 outline-none focus:outline-none"
            >
              <svg
                className={`${open ? 'w-4 h-4' : 'w-7 h-7'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span
                className={`font-serif text-lg text-slate-200 ml-4 ${
                  !open && 'hidden'
                }`}
              >
                {' '}
                Categories
              </span>
            </NextLink>
          </li>
          <li>
            <NextLink
              href="/tags"
              className="inline-flex items-center w-full px-4 py-2 mt-1 text-base transition duration-500 ease-in-out transform rounded-lg text-slate-200 hover:bg-slate-900 focus:shadow-outline hover:cursor-pointer focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-900 outline-none focus:outline-none"
            >
              <svg
                className={`${open ? 'w-4 h-4' : 'w-7 h-7'}`}
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
              <span
                className={`font-serif text-lg text-slate-200 ml-4 ${
                  !open && 'hidden'
                }`}
              >
                {' '}
                Tags
              </span>
            </NextLink>
          </li>
        </ul>
        {open && (
          <>
            <div className="px-4 pt-4 font-medium text-neutral-200 mb-2 flex items-center justify-between space-x-2">
              <div className="flex items-center justify-start">
                <h2 className="font-serif text-lg text-slate-200">
                  Categories
                </h2>
                <button
                  className="focus:ring-2 focus:ring-slate-200 ml-1 rounded-md outline-none hidden flex-1 justify-end hover:cursor-pointer lg:flex"
                  onClick={() => {
                    toggleQuickAdd('category')
                    setTimeout(() => {
                      quickAddCategoryRef.current.focus()
                    }, 0)
                  }}
                >
                  <svg
                    className="h-5 w-5 text-slate-300"
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
              <div className="flex items-center">
                <button
                  className="rounded-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 focus-visible:ring-white "
                  onClick={toggleOpenCategory}
                >
                  <svg
                    className={`w-5 h-5 transition duration-200 ease-in-out ${
                      openCategory ? 'rotate-90' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <ul>
              <div className="ml-2 flex flex-col items-start space-y-2 md:ml-4">
                {openCategory &&
                  categories?.map((cat) => (
                    <button
                      onClick={() => applyCategoryFilter(cat.id)}
                      key={cat.id}
                      className={`focus:(ring-2,ring-slate-200) inline-block rounded-md px-1 text-left font-serif text-slate-400 outline-none ${
                        categoryFilter === cat.id && 'font-extrabold'
                      }`}
                    >
                      {cat.name}
                      <span className="text-sm text-slate-200 bg-slate-700 rounded-md px-1 text-center ml-2">
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
            <div className="px-4 pt-4 font-medium text-neutral-200 mb-2 flex items-center justify-between space-x-2">
              <div className="flex items-center justify-start">
                <h2 className="font-serif text-lg text-slate-200">Tags</h2>
                <button
                  className="focus:ring-2 focus:ring-slate-200 ml-1 rounded-md outline-none hidden flex-1 justify-end hover:cursor-pointer lg:flex"
                  onClick={() => {
                    toggleQuickAdd('tag')
                    setTimeout(() => {
                      quickAddTagRef.current.focus()
                    }, 0)
                  }}
                >
                  <svg
                    className="h-5 w-5 text-slate-300"
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
              <div className="flex items-center">
                <button
                  className="rounded-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 focus-visible:ring-white "
                  onClick={toggleOpenTag}
                >
                  <svg
                    className={`w-5 h-5 transition duration-200 ease-in-out ${
                      openTag ? 'rotate-90' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <ul className="overflow-y-scroll">
              <div className="ml-2 flex flex-col items-start space-y-2 md:ml-4 mb-4">
                {openTag &&
                  tags?.map((tag) => (
                    <button
                      onClick={() => applyTagFilter(tag.id)}
                      key={tag.id}
                      className={`inline-block rounded-md px-1 text-left font-serif text-slate-400 outline-none focus:ring-2 focus:ring-slate-200 ${
                        tagFilter === tag.id && 'font-extrabold'
                      }`}
                    >
                      {tag.emoji} <span className="ml-1">{tag.name}</span>{' '}
                      <span className="text-slate-200 bg-slate-700 rounded-md px-1 text-sm text-center ml-1">
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
          </>
        )}
      </div>
      <div className="w-full group flex p-4 px-4 bg-slate-900 items-center justify-between rounded-br-md">
        <div className="flex justify-start items-center">
          <Menu as="div" className="relative inline-block text-left z-50">
            <Menu.Button className="flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 focus-visible:ring-white focus-visible:ring-opacity-75 rounded-full">
              <img
                className={`inline-block rounded-full ${
                  open ? 'h-9 w-9' : 'h-9 w-9'
                }`}
                src={session?.user?.image}
                alt=""
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100 z-50"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 bottom-16 mt-2 w-56 origin-bottom-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <NextLink
                        href="/profile"
                        className={`${
                          active ? 'bg-slate-500 text-white' : 'text-gray-900'
                        } group flex w-full justify-start space-x-2 items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            active ? 'text-slate-200' : 'text-slate-600'
                          }`}
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Profile</span>
                      </NextLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NextLink
                        href="/settings"
                        className={`${
                          active ? 'bg-slate-500 text-white' : 'text-gray-900'
                        } group flex w-full justify-start space-x-2 items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            active ? 'text-slate-200' : 'text-slate-600'
                          }`}
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                          />
                        </svg>
                        <span>Settings</span>
                      </NextLink>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={signOut}
                        className={`${
                          active ? 'bg-slate-500 text-white' : 'text-gray-900'
                        } group flex w-full justify-start space-x-2 items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            active ? 'text-slate-200' : 'text-slate-600'
                          }`}
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {open && (
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-200">
                {session?.user?.name}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            toggleOpen()
            setValue(!open)
          }}
          className="text-slate-200 rounded-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 focus-visible:ring-white"
        >
          <svg
            className={` transition duration-300 ease-in-out w-6 h-6 ${
              open ? 'rotate-270' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    </aside>
  )
}
