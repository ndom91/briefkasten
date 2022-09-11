import { useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { useToast, toastTypes } from '@/lib/hooks'
import { useToggle, useClickAway } from 'react-use'
import { useFocusTrap } from 'react-use-focus-trap'

import { Fragment } from 'react'
import { Combobox, Listbox, Popover, Transition } from '@headlessui/react'
import Chip from '@/components/chip'

export default function QuickAdd({ categories, session }) {
  const [open, toggleOpen] = useToggle(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const addBookmark = useStore((state) => state.addBookmark)
  const tags = useStore((state) => state.tags)
  const [selectedTags, setSelectedTags] = useState([])
  const [comboQuery, setComboQuery] = useState('')

  const popoverRef = useRef(null)
  const [trapRef] = useFocusTrap()

  useClickAway(popoverRef, () => toggleOpen())

  const toast = useToast(5000)

  const clearInputs = () => {
    setUrl('')
    setTitle('')
    setCategory('')
    setSelectedTags([])
    setDescription('')
  }

  async function submitUrl() {
    try {
      setLoading(true)
      if (!url) {
        toast(toastTypes.ERROR, 'Missing required field(s)')
        setLoading(false)
        return
      }
      if (
        url?.length > 182 ||
        category?.length > 190 ||
        title?.length > 190 ||
        description?.length > 190
      ) {
        toast(toastTypes.WARNING, 'Field too long')
        setLoading(false)
        return
      }

      // Add Bookmark to DB via API
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          userId: session?.user?.userId,
          description,
          category,
          tags: selectedTags.map((tag) => tag.name),
          title,
        }),
      })
      if (res.status === 200) {
        toast(toastTypes.SUCCESS, 'Successfully added', title)
        const { data } = await res.json()

        // Add new Bookmark to UI
        addBookmark({
          url: data.url,
          createdAt: data.createdAt,
          id: data.id,
          desc: data.desc,
          image: data.image,
          title: data.title,
          tags: data.tags,
          category: data.category,
        })

        // Empty fields and toggle closed
        setUrl('')
        setTitle('')
        setCategory('')
        setSelectedTags([])
        setDescription('')
        toggleOpen()
      } else {
        toast(toastTypes.ERROR, 'Error Saving')
      }
      setLoading(false)
    } catch (error) {
      console.error('[ERROR] Submitting URL', error)
      toast(toastTypes.ERROR, 'Error adding', title)
      setLoading(false)
    }
  }

  const removeSelectedTag = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId))
  }

  const filteredTags =
    comboQuery === ''
      ? tags
      : tags.filter((tag) => {
          return tag.name.toLowerCase().includes(comboQuery.toLowerCase())
        })

  return (
    <div>
      <Popover className="" ref={trapRef}>
        {() => (
          <>
            <Popover.Button
              onClick={toggleOpen}
              className={`${
                open ? '' : 'text-opacity-90'
              } absolute bottom-8 right-8 z-[60] hidden rounded-full bg-slate-800 p-2 outline-none drop-shadow-md transition hover:-translate-y-1 hover:drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 focus:ring-offset-white md:block`}
            >
              <svg
                className={`h-8 w-8 text-slate-200 transition duration-300 ${
                  open ? 'rotate-[225deg]' : 'rotate-0'
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </Popover.Button>
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                static
                className="absolute right-8 bottom-24 z-[56] mt-3 hidden w-full max-w-sm origin-bottom-right px-4 sm:px-0 md:block md:max-w-xl"
              >
                <div
                  ref={popoverRef}
                  className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <div className="relative flex flex-col space-y-4 bg-white p-7">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-slate-900">
                        Quick Add
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        Add a new bookmark directly to your collection.
                      </p>
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
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
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
                        <input
                          type="text"
                          name="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="block w-full flex-1 rounded-md border-slate-300 placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                          placeholder="https://www.example.com"
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
                      <Listbox value={category} onChange={setCategory}>
                        <div className="relative mt-1 min-h-[38px]">
                          <Listbox.Button className="relative min-h-[38px] w-full cursor-default rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-sm">
                            <span className="block w-full flex-1 rounded-md border-slate-300 outline-none placeholder:text-slate-300 focus:border-slate-600 focus:outline-none sm:text-sm">
                              {category}
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
                              {categories.map((cat) => (
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
                                      {category === cat.name ? (
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
                      <div className="mt-2 flex w-full flex-1 flex-wrap gap-1 rounded-none rounded-r-md border-slate-300 placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                        {selectedTags.map((tag) => {
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
                              // displayValue={(tags) =>
                              //   tags.map((tag) => tag.name).join(', ')
                              // }
                              onChange={(event) => {
                                setComboQuery(event.target.value)
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
                            // afterLeave={() => setComboQuery('')}
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
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm placeholder:text-slate-300 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                          placeholder="Leave blank to use the default detected description from meta tags"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4">
                    <div className="flex space-x-2 px-4 text-right">
                      <button
                        onClick={submitUrl}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      >
                        {loading ? (
                          <svg
                            className="h-5 w-5 animate-spin text-white sm:mr-1"
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
                            className="h-4 w-4 text-white sm:mr-1"
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
                        className="inline-flex justify-center rounded-md border border-transparent border-slate-600 py-2 px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-in duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Overlay className="fixed top-0 left-0 z-[55] h-full w-full bg-black bg-opacity-40 transition" />
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
