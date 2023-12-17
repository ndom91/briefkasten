"use client"

import Link from "next/link"
import { Menu, Transition } from "@headlessui/react"
import { useLocalStorage } from "react-use"
import { useSession } from "next-auth/react"
import { useState, useRef, Fragment } from "react"
import { useToast, toastTypes } from "@/lib/hooks"
import { useStore } from "@/lib/store"
import { SignOut } from "@/components/signOut"

const types = {
  CATEGORY: "category",
  TAG: "tag",
}

export default function Sidebar() {
  const session = useSession()
  const categories = useStore((state) => state.categories)
  const tags = useStore((state) => state.tags)
  const setCategoryFilter = useStore((state) => state.setCategoryFilter)
  const setTagFilter = useStore((state) => state.setTagFilter)
  const categoryFilter = useStore((state) => state.categoryFilter)
  const tagFilter = useStore((state) => state.tagFilter)
  const addCategory = useStore((state) => state.addCategory)
  const addTag = useStore((state) => state.addTag)

  const [openCategories, setOpenCategories] = useLocalStorage("dashboard.sidebar.categories", true)
  const [openTags, setOpenTags] = useLocalStorage("dashboard.sidebar.tags", true)
  const [open, setOpen] = useLocalStorage("dashboard.sidebar.open", true)

  const [quickAdd, setQuickAdd] = useState("")
  const [quickAddCategory, setQuickAddCategory] = useState("")
  const [quickAddTag, setQuickAddTag] = useState("")

  const toast = useToast(5000)
  const quickAddTagRef = useRef()
  const quickAddCategoryRef = useRef()

  const toggleQuickAdd = (type) => {
    if (type === types.CATEGORY) {
      setQuickAdd(types.CATEGORY)
    } else if (type === types.TAG) {
      setQuickAdd(types.TAG)
    } else {
      setQuickAdd("")
    }
  }

  const saveQuickCategory = async () => {
    try {
      const saveRes = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.data?.user?.userId,
          name: quickAddCategory,
        }),
      })
      if (saveRes.status === 200) {
        const saveData = await saveRes.json()
        addCategory({ id: saveData.data.id, name: quickAddCategory })
        setQuickAddCategory("")
        toggleQuickAdd("")
        toast(toastTypes.SUCCESS, "Successfully Saved Category")
      }
    } catch (error) {
      toast(toastTypes.ERROR, "Error Saving Category")
    }
  }

  const saveQuickTag = async () => {
    try {
      const saveRes = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.data?.user?.userId,
          name: quickAddTag,
        }),
      })
      if (saveRes.status === 200) {
        const saveData = await saveRes.json()
        addTag({ id: saveData.data.id, name: quickAddTag })
        setQuickAddTag("")
        toggleQuickAdd("")
        toast(toastTypes.SUCCESS, "Successfully Saved Tag")
      }
    } catch (error) {
      toast(toastTypes.ERROR, "Error Saving Tag")
    }
  }

  const applyCategoryFilter = (id) => {
    // if (router.pathname !== "/") return
    if (id === categoryFilter) {
      setCategoryFilter("")
      return
    }
    setCategoryFilter(id)
  }

  const applyTagFilter = (id) => {
    // if (router.pathname !== "/") return
    if (id === tagFilter) {
      setTagFilter("")
      return
    }
    setTagFilter(id)
  }

  return (
    <aside
      className={`z-20 max-h-screen drop-shadow-md ${
        open ? "basis-72" : "basis-20 sm:basis-24"
      } flex flex-col rounded-r-md bg-slate-800 pt-5 transition`}
    >
      <div className="flex items-center justify-center px-4">
        <Link href="/" legacyBehavior>
          <div className="flex items-center hover:cursor-pointer">
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
              <span className="ml-3 font-serif text-xl font-semibold text-slate-200">
                Briefkasten
              </span>
            )}
          </div>
        </Link>
      </div>
      <div
        className={`mt-5 flex flex-grow flex-col bg-slate-800 px-4 ${open && "overflow-y-scroll"}`}
      >
        <ul>
          <li>
            <Link href="/" legacyBehavior>
              <div className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-2 py-2 text-base text-slate-200 outline-none transition duration-500 ease-in-out hover:cursor-pointer hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-900 md:px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${open ? "h-5 w-5" : "h-7 w-7"}`}
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
                <span className={`ml-4 font-serif text-lg text-slate-200 ${!open && "hidden"}`}>
                  {" "}
                  Home
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/categories" legacyBehavior>
              <div className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-2 py-2 text-base text-slate-200 outline-none transition duration-500 ease-in-out hover:cursor-pointer hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-900 md:px-4">
                <svg
                  className={`${open ? "h-5 w-5" : "h-7 w-7"}`}
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
                <span className={`ml-4 font-serif text-lg text-slate-200 ${!open && "hidden"}`}>
                  {" "}
                  Categories
                </span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/tags" legacyBehavior>
              <div className="focus:shadow-outline mt-1 inline-flex w-full transform items-center rounded-lg px-2 py-2 text-base text-slate-200 outline-none transition duration-500 ease-in-out hover:cursor-pointer hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-slate-900 md:px-4">
                <svg
                  className={`${open ? "h-5 w-5" : "h-7 w-7"}`}
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
                <span className={`ml-4 font-serif text-lg text-slate-200 ${!open && "hidden"}`}>
                  {" "}
                  Tags
                </span>
              </div>
            </Link>
          </li>
        </ul>
        {open && (
          <>
            <div className="mb-2 flex items-center justify-between space-x-2 px-4 pt-4 font-medium text-neutral-200">
              <div className="flex items-center justify-start">
                <h2 className="font-serif text-lg text-slate-200">Categories</h2>
                <button
                  className="ml-1 hidden flex-1 justify-end rounded-md outline-none hover:cursor-pointer focus:ring-2 focus:ring-slate-200 lg:flex"
                  onClick={() => {
                    toggleQuickAdd("category")
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
                  className="rounded-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 "
                  onClick={() => setOpenCategories(!openCategories)}
                >
                  <svg
                    className={`h-5 w-5 transition duration-200 ease-in-out ${
                      openCategories ? "rotate-90" : "rotate-0"
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
                {openCategories &&
                  categories?.map((cat) => (
                    <button
                      onClick={() => applyCategoryFilter(cat.id)}
                      key={cat.id}
                      className={`inline-block rounded-md px-2 text-left font-serif text-slate-400 outline-none focus:ring-2 focus:ring-slate-200 ${
                        categoryFilter === cat.id && "font-extrabold"
                      }`}
                    >
                      {cat.name}
                      <span className="ml-2 rounded-md bg-slate-700 px-1 text-center text-sm text-slate-200">
                        {cat["_count"]?.bookmarks ?? 0}
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
                      <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        toggleQuickAdd("")
                        setQuickAddCategory("")
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
            <div className="mb-2 flex items-center justify-between space-x-2 px-4 pt-4 font-medium text-neutral-200">
              <div className="flex items-center justify-start">
                <h2 className="font-serif text-lg text-slate-200">Tags</h2>
                <button
                  className="ml-1 hidden flex-1 justify-end rounded-md outline-none hover:cursor-pointer focus:ring-2 focus:ring-slate-200 lg:flex"
                  onClick={() => {
                    toggleQuickAdd("tag")
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
                  className="rounded-lg outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900 "
                  onClick={() => setOpenTags(!openTags)}
                >
                  <svg
                    className={`h-5 w-5 transition duration-200 ease-in-out ${
                      openTags ? "rotate-90" : "rotate-0"
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
              <div className="mb-4 ml-2 flex flex-col items-start space-y-2 md:ml-4">
                {openTags &&
                  tags.map((tag) => (
                    <button
                      onClick={() => applyTagFilter(tag.id)}
                      key={tag.id}
                      className={`inline-block rounded-md px-2 text-left font-serif text-slate-400 outline-none focus:ring-2 focus:ring-slate-200 ${
                        tagFilter === tag.id && "font-extrabold"
                      }`}
                    >
                      {tag.emoji} <span className="ml-1">{tag.name}</span>{" "}
                      <span className="ml-1 rounded-md bg-slate-700 px-1 text-center text-sm text-slate-200">
                        {tag["_count"]?.bookmarks ?? 0}
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
                      <svg className="h-6 w-6 text-slate-600" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        toggleQuickAdd("")
                        setQuickAddTag("")
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
      <div className="group flex w-full items-center justify-between rounded-br-md bg-slate-900 p-2 py-4 md:p-4">
        <div className="flex items-center justify-start">
          <Menu as="div" className="relative z-50 inline-block text-left">
            <Menu.Button className="flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900">
              {/* eslint-disable @next/next/no-img-element */}
              <img
                className={`inline-block rounded-full ${
                  open ? "h-9 w-9" : "h-8 w-8 md:h-9 md:w-9"
                }`}
                src={
                  session.data?.user?.image ??
                  ` https://unavatar.io/${session.data?.user?.email ?? session.data?.user?.id}`
                }
                alt="User Avatar"
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="scale-95 transform opacity-0"
              enterTo="scale-100 transform opacity-100"
              leave="transition duration-75 ease-in"
              leaveFrom="scale-100 transform opacity-100"
              leaveTo="scale-95 transform opacity-0"
            >
              <Menu.Items className="absolute bottom-16 left-0 mt-2 w-56 origin-bottom-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        // onClick={() => router.push("/settings")}
                        className={`${
                          active ? "bg-slate-500 text-white" : "text-gray-900"
                        } group flex w-full items-center justify-start space-x-2 rounded-md px-2 py-2 text-sm`}
                      >
                        <svg
                          className={`h-5 w-5 ${active ? "text-slate-200" : "text-slate-600"}`}
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
                      </button>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>{({ active }) => <SignOut active={active} />}</Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {open && (
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-200">{session.data?.user?.name}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg text-slate-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900"
        >
          <svg
            className={` h-6 w-6 transition duration-300 ease-in-out ${
              open ? "rotate-270" : "rotate-180"
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
