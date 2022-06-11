import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { useToast, toastTypes } from '@/lib/hooks'
import { useKeyPress, useToggle } from 'react-use'

import { Fragment } from 'react'
import { Combobox, Listbox, Popover, Transition } from '@headlessui/react'
import Chip from '@/components/chip'

export default function QuickAdd({ categories }) {
  const { data: session } = useSession()

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

  const toast = useToast(5000)

  useKeyPress((e) => {
    if (e.type === 'keyup') {
      if (e.altKey && e.key === 'a') {
        insertRef?.current?.focus()
      }
      if (e.altKey && e.key === 's') {
        submitUrl()
      }
    }
  })

  const clearInputs = () => {
    console.log('clearing')
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
          url: `https://${url}`,
          userId: session?.user?.userId,
          description,
          category,
          tags: selectedTags.map((tag) => tag.name),
          title,
        }),
      })
      if (res.status === 200) {
        toast(toastTypes.SUCCESS, `Successfully added "${title}"`)
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
        open && toggleOpen()
      } else {
        toast(toastTypes.ERROR, 'Error Saving')
      }
      setLoading(false)
    } catch (error) {
      console.error('[ERROR] Submitting URL', error)
      toast(toastTypes.ERROR, `Error adding "${title}"`)
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
      <Popover open={open} className="">
        {({ open }) => (
          <>
            <Popover.Button
              className={`${
                open ? '' : 'text-opacity-90'
              } z-20 hidden lg:block rounded-full bg-slate-800 p-2 absolute bottom-8 right-8 drop-shadow-md transition hover:-translate-y-1 hover:drop-shadow-lg outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-slate-800`}
            >
              <svg
                className={`w-8 h-8 text-slate-200 transition duration-300 ${
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
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="z-20 absolute hidden lg:block right-8 bottom-24 origin-bottom-right mt-3 w-full max-w-sm px-4 sm:px-0 lg:max-w-xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative flex bg-white p-7 flex-col space-y-4">
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
                          className="focus:ring-slate-500 focus:border-slate-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-slate-300 placeholder:text-slate-300"
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
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                          https://
                        </span>
                        <input
                          type="text"
                          name="url"
                          id="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="focus:ring-slate-500 focus:border-slate-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-slate-300 placeholder:text-slate-300"
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
                      <Listbox value={category} onChange={setCategory}>
                        <div className="relative mt-1 min-h-[38px]">
                          <Listbox.Button className="relative min-h-[38px] w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-slate-300 focus:outline-none focus-visible:border-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-sm">
                            <span className="flex-1 block w-full rounded-md sm:text-sm border-slate-300 placeholder:text-slate-300 focus:outline-none outline-none focus:border-slate-600">
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
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-md focus:outline-none sm:text-sm z-10">
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
                      <div className="focus:ring-slate-500 focus:border-slate-500 flex-1 w-full rounded-none rounded-r-md sm:text-sm border-slate-300 placeholder:text-slate-300 flex flex-wrap gap-1 mt-2">
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
                                name={`${tag.emoji} ${tag.name}`}
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
                          <div className="rounded-md relative w-full cursor-default overflow-hidden text-left shadow-sm focus:outline-none sm:text-sm">
                            <Combobox.Input
                              className="flex-1 block w-full rounded-md sm:text-sm border-slate-300 placeholder:text-slate-300 focus:outline-none outline-none focus:border-slate-600"
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
                          className="shadow-sm focus:ring-slate-500 focus:border-slate-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md placeholder:text-slate-300"
                          placeholder="Leave blank to use the default detected description from meta tags"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4">
                    <div className="flex space-x-2 text-right px-4">
                      <button
                        onClick={submitUrl}
                        className="inline-flex transition justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 items-center"
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
                        className="inline-flex transition justify-center py-2 px-4 border border-transparent shadow-sm text-slate-700 text-sm font-medium rounded-md bg-white border-slate-600 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                      >
                        Clear
                      </button>
                    </div>
                    {/* <a */}
                    {/*   href="##" */}
                    {/*   className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50" */}
                    {/* > */}
                    {/*   <span className="flex items-center"> */}
                    {/*     <span className="text-sm font-medium text-slate-900"> */}
                    {/*       Documentation */}
                    {/*     </span> */}
                    {/*   </span> */}
                    {/*   <span className="block text-sm text-slate-500"> */}
                    {/*     Start integrating products and tools */}
                    {/*   </span> */}
                    {/* </a> */}
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
              <div className="fixed transition top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10" />
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
