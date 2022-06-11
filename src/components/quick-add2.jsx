import { useKeyPress, useToggle } from 'react-use'
import { useState } from 'react'
import { useToast, toastTypes } from '@/lib/hooks'
import { useStore } from '@/lib/store'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'

export default function QuickAdd() {
  const [open, toggleOpen] = useToggle(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [desc, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const addBookmark = useStore((state) => state.addBookmark)

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

  async function submitUrl() {
    try {
      setLoading(true)
      if (!url) {
        toast(toastTypes.ERROR, 'Missing required field(s)')
        setLoading(false)
        return
      }
      if (
        url?.length > 190 ||
        category?.length > 190 ||
        title?.length > 190 ||
        desc?.length > 190
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
          desc,
          category,
          tags: tags.split(' '),
          title,
        }),
      })
      if (res.status === 200) {
        toast(
          toastTypes.SUCCESS,
          `Successfully added "${new URL(url).hostname}"`
        )
        const { data } = await res.json()

        // Add new Bookmark to UI
        addBookmark({
          url,
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
        setTags('')
        setDescription('')
        open && toggleOpen()
      } else {
        toast(toastTypes.ERROR, 'Error Saving')
      }
      setLoading(false)
    } catch (error) {
      console.error('[ERROR] Submitting URL', error)
      toast(toastTypes.ERROR, `Error adding "${new URL(url).hostname}"`)
      setLoading(false)
    }
  }

  return (
    <div>
      <Popover className="">
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
                  <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                    ITEMS!
                  </div>
                  <div className="bg-gray-50 p-4">
                    <a
                      href="##"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          Documentation
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500">
                        Start integrating products and tools
                      </span>
                    </a>
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
