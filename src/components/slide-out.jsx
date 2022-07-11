import { useStore } from '@/lib/store'
import { useToggle } from 'react-use'
import { useEffect, useState, Fragment } from 'react'
import { useToast, toastTypes } from '@/lib/hooks'

import { Combobox, Listbox, Dialog, Transition } from '@headlessui/react'
import Chip from '@/components/chip'

const fallbackUnsplash = `https://source.unsplash.com/random/300x201?sig=${Math.floor(
  Math.random() * 100
)}`

export default function SlideOut({ open, toggleOpen, session }) {
  const tags = useStore((state) => state.tags)
  const categories = useStore((state) => state.categories)
  const updateBookmark = useStore((state) => state.updateBookmark)
  const editBookmark = useStore((state) => state.editBookmark)
  const settings = useStore((state) => state.settings)

  useEffect(() => {
    const { title, desc, url, category, tags } = editBookmark

    setEditTitle(title ?? '')
    setEditCategory(category?.name)
    setEditUrl(url?.indexOf('https://') === 0 ? url.slice(8, url.length) : url)
    setEditDesc(desc ?? '')
    setSelectedTags(tags)
  }, [editBookmark])

  const [selectedTags, setSelectedTags] = useState([])
  const [comboQuery, setComboBoxQuery] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [loading, toggleLoading] = useToggle(false)
  const toast = useToast(5000)

  const saveEdit = async () => {
    try {
      toggleLoading(true)
      const updateRes = await fetch('/api/bookmarks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editBookmark.id,
          userId: session.user.userId,
          title: editTitle,
          url: `https://${editUrl}`,
          desc: editDesc,
          category: editCategory,
          tags: selectedTags.map((tag) => tag.name),
        }),
      })
      if (updateRes.status === 200) {
        const { data } = await updateRes.json()
        updateBookmark({
          id: data.id,
          title: data.title,
          url: data.url,
          desc: data.desc,
          image: data.image,
          category: data.category,
          tags: data.tags,
        })
        toast(toastTypes.SUCCESS, 'Successfully edited', editTitle)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, 'Error editing bookmark', error.message)
    }
    toggleLoading(false)
    toggleOpen()
  }

  const removeSelectedTag = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId))
  }

  const clearInputs = () => {
    setEditTitle('')
    setEditCategory('')
    setEditUrl('')
    setEditDesc('')
    setSelectedTags([])
  }

  const refreshImage = (e) => {
    console.log(e)
  }

  const filteredTags =
    comboQuery === ''
      ? tags
      : tags.filter((tag) => {
          return tag.name.toLowerCase().includes(comboQuery.toLowerCase())
        })

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 -right-3 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => toggleOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 pt-6 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Editing {editBookmark.title}
                      </Dialog.Title>
                      <p className="flex items-center justify-start space-x-2 text-sm font-light text-gray-400">
                        <svg
                          className="inline-block h-4 w-4 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span className="mt-1">
                          {new Date(editBookmark.createdAt).toLocaleString(
                            settings.locale
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="relative mb-6 flex-1 space-y-6 overflow-y-scroll px-4 sm:px-6">
                      <div className="relative mt-6">
                        <button
                          title="Refresh Image in Background"
                          className="absolute top-2 right-2 z-10 text-gray-500 transition hover:animate-spin"
                          onClick={refreshImage}
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </button>
                        {/* eslint-disable @next/next/no-img-element */}
                        <img
                          src={editBookmark.image ?? fallbackUnsplash}
                          alt={`${editBookmark.title} Cover Image`}
                          className="aspect-2 max-h-[384px] w-full rounded-md border-2 border-slate-300 drop-shadow-sm"
                        />
                      </div>
                      <div className="flex flex-col items-stretch justify-around">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Title
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="block w-full flex-1 rounded-md border-slate-300 placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-stretch justify-around">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-slate-700"
                        >
                          URL
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                            https://
                          </span>
                          <input
                            type="text"
                            name="url"
                            id="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className="block w-full flex-1 rounded-none rounded-r-md border-slate-300 placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                            placeholder="www.example.com"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-stretch justify-around">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Category
                        </label>
                        <Listbox
                          value={editCategory}
                          onChange={setEditCategory}
                        >
                          <div className="relative mt-1 min-h-[38px]">
                            <Listbox.Button className="relative min-h-[38px] w-full cursor-default rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-sm">
                              <span className="block w-full flex-1 rounded-md border-slate-300 outline-none placeholder:text-slate-300 focus:border-slate-600 focus:outline-none sm:text-sm">
                                {editCategory}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg
                                  className="h-5 w-5 text-gray-400"
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
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                  />
                                </svg>
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md focus:outline-none sm:text-sm">
                                {categories.filter(Boolean).map((cat) => (
                                  <Listbox.Option
                                    key={cat.id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? 'bg-slate-100 text-slate-900'
                                          : 'text-gray-900'
                                      }`
                                    }
                                    value={cat.name}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? 'font-medium'
                                              : 'font-normal'
                                          }`}
                                        >
                                          {cat.name}
                                        </span>
                                        {editCategory === cat.name ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600">
                                            <svg
                                              className="h-5 w-5"
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
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>
                      <div className="flex flex-col items-stretch justify-around">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Tags
                        </label>
                        <div className="my-2 flex w-full flex-1 flex-wrap gap-1 rounded-none rounded-r-md border-slate-300 placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                          {selectedTags?.filter(Boolean).map((tag) => {
                            return (
                              <Transition
                                appear
                                key={tag.id}
                                enter="transition ease-in-out duration-250"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in-out duration-250"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Chip
                                  name={`${tag.emoji ?? ''} ${tag.name}`}
                                  id={tag.id}
                                  remove={removeSelectedTag}
                                />
                              </Transition>
                            )
                          })}
                        </div>
                        <Combobox
                          value={selectedTags}
                          onChange={setSelectedTags}
                          nullable
                          multiple
                        >
                          <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-md text-left shadow-sm focus:outline-none sm:text-sm">
                              <Combobox.Input
                                className="block w-full flex-1 rounded-md border-slate-300 outline-none placeholder:text-slate-300 focus:border-slate-600 focus:outline-none sm:text-sm"
                                onChange={(event) => {
                                  setComboBoxQuery(event.target.value)
                                }}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg
                                  className="h-5 w-5 text-gray-400"
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
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                  />
                                </svg>
                              </Combobox.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {tags.length === 0 && comboQuery !== '' ? (
                                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                  </div>
                                ) : (
                                  filteredTags.map((tag) => (
                                    <Combobox.Option
                                      key={tag.id}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                          active
                                            ? 'bg-slate-800 text-white'
                                            : 'text-gray-900'
                                        }`
                                      }
                                      value={tag}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? 'font-medium'
                                                : 'font-normal'
                                            }`}
                                          >
                                            {tag.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active
                                                  ? 'text-white'
                                                  : 'text-slate-800'
                                              }`}
                                            >
                                              <svg
                                                className="h-5 w-5"
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
                                                  d="M5 13l4 4L19 7"
                                                />
                                              </svg>
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Combobox.Option>
                                  ))
                                )}
                              </Combobox.Options>
                            </Transition>
                          </div>
                        </Combobox>
                      </div>
                      <div className="flex flex-col items-stretch justify-around">
                        <label
                          htmlFor="desc"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="desc"
                            name="desc"
                            rows={3}
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                            placeholder="Leave blank to use the default detected description from meta tags"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4">
                      <div className="flex justify-evenly space-x-2 px-4 text-right">
                        <button
                          onClick={saveEdit}
                          className="inline-flex flex-1 items-center justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                          {loading ? (
                            <svg
                              className="h-5 w-5 animate-spin text-white sm:mr-2"
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
                            <svg
                              className="h-4 w-4 text-white sm:mr-2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                              />
                            </svg>
                          )}
                          Save
                        </button>
                        <button
                          onClick={clearInputs}
                          className="flex flex-1 justify-center rounded-md border border-transparent border-slate-600 py-2 px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
