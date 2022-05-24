import { getServerSession } from 'next-auth/next'
import { useStore, initializeStore } from '@/lib/store'
import { useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import Head from 'next/head'
import Layout from '@/components/layout'
import Sidebar from '@/components/sidebar'
import { authOptions } from './api/auth/[...nextauth]'
import { useToast, toastTypes } from '@/lib/hooks'
import prisma from '@/lib/prisma'

export default function Settings({ nextauth }) {
  const bookmarks = useStore((state) => state.bookmarks)
  const [fileContents, setFileContents] = useState('')
  const [fileName, setFileName] = useState('')
  const toast = useToast(5000)
  const [_, copyToClipboard] = useCopyToClipboard()

  const enqueueImageFix = () => {
    console.log('Enqeueing Image Fix')
    console.log('fetch("workers.cloudflare.dev/fetchScreenshots...)')
  }

  const exportBookmarks = () => {
    console.log(bookmarks)
  }

  const handleInputFile = (file) => {
    setFileName(file.name)
    const fileReader = new FileReader()
    fileReader.onloadend = (e) => {
      setFileContents(e.currentTarget.result)
    }
    fileReader.readAsText(file)
  }

  const importBookmarks = async () => {
    const domParser = new DOMParser()
    const doc = domParser.parseFromString(fileContents, 'text/html')
    const dataElements = doc.querySelectorAll('dl dt')
    const bookmarks = Array.from(dataElements).map((element) => {
      let url = ''
      let title = ''
      let desc = ''
      let tags = ''
      let date = ''

      if (element.tagName === 'DT') {
        title = element.textContent
          ?.replaceAll('\n', '')
          .trim()
          .substring(0, 190)
        url = element.firstElementChild?.attributes?.href.value.trim()
        date = element.firstElementChild?.attributes?.add_date.value.trim()
        tags = element.firstElementChild?.attributes?.tags.value
          .trim()
          .split(',')
        desc = element.nextSibling?.innerText?.replaceAll('\n', '').trim()

        return {
          title,
          url,
          createdAt: parseInt(date)
            ? new Date(parseInt(date) * 1000).toISOString()
            : 0,
          // tags,
          desc,
          userId: nextauth?.user?.userId,
        }
      }
    })

    const bulkCreateRes = await fetch('/api/bookmarks/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookmarks),
    })

    const bulkCreateData = await bulkCreateRes.json()

    if (bulkCreateData.data.count === bookmarks.length) {
      toast(
        toastTypes.SUCCESS,
        `Successfully imported ${bookmarks.length} bookmarks`
      )
    } else if (bulkCreateData.data.count) {
      console.warn(bulkCreateData)
      toast(
        toastTypes.WARNING,
        `Successfully imported only ${bookmarks.length} bookmarks`
      )
    } else {
      console.error(bulkCreateData)
      toast(toastTypes.ERROR, `Error importing bookmarks`)
    }
  }

  const copyUserId = () => {
    copyToClipboard(nextauth?.user?.userId)
    toast(toastTypes.SUCCESS, 'Copied Token')
  }

  return (
    <Layout>
      <Head>
        <title>Briefkasten | Settings</title>
      </Head>
      <Sidebar />
      <main className="flex flex-col space-y-4 px-4 pt-4">
        <h2 className="text-xl">Settings</h2>
        <section className="flex flex-col items-start justify-center space-y-4 rounded-md bg-slate-50 p-4">
          <div className="flex items-center">
            <h2 className="text-lg text-slate-700">API Token</h2>
          </div>
          <label className="text-slate-500">
            For use in the{' '}
            <a
              href="https://github.com/ndom91/briefkasten-extension"
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none focus:underline"
            >
              briefkasten extension
            </a>
            , you can use the following token.
          </label>
          <div className="relative flex">
            <pre className="rounded-md bg-slate-200 p-2 pl-4 pr-10">
              {nextauth?.user?.userId}
            </pre>
            <button
              onClick={() => copyUserId()}
              className="absolute right-2 top-1.5 rounded-md p-1 text-slate-500 outline-none hover:text-slate-700 focus:ring-2 focus:ring-slate-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
          </div>
        </section>
        <section className="flex flex-col items-start space-y-4 rounded-md bg-slate-50 p-4">
          <h2 className="text-lg text-slate-700">Import</h2>
          <label className="text-slate-500">
            Upload a file exported from another tool, or your browser. Click{' '}
            <q>browse</q> or drop a{' '}
            <code className="rounded-md bg-slate-200 py-1 px-2">*.html</code>{' '}
            file of bookmarks onto the area below. After the file has been
            uploaded and its name appears in the upload widget, you can press{' '}
            <q>Import</q> to start the import process.
          </label>
          <label className="flex w-1/2 cursor-pointer appearance-none justify-center rounded-md border border-dashed border-gray-300 bg-white px-3 py-6 text-sm transition hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75">
            <span
              htmlFor="photo-dropbox"
              className="flex items-center space-x-2"
            >
              <svg className="h-6 w-6 stroke-gray-400" viewBox="0 0 256 256">
                <path
                  d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></path>
                <path
                  d="M80,128a80,80,0,1,1,144,48"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></path>
                <polyline
                  points="118.1 161.9 152 128 185.9 161.9"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></polyline>
                <line
                  x1="152"
                  y1="208"
                  x2="152"
                  y2="128"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="24"
                ></line>
              </svg>
              <span className="text-xs font-medium text-gray-600">
                {!fileName ? (
                  <span>
                    Drop files to Attach, or{' '}
                    <span className="text-blue-600 underline">browse</span>
                  </span>
                ) : (
                  <span>{fileName}</span>
                )}
              </span>
            </span>
            <input
              id="photo-dropbox"
              type="file"
              className="sr-only"
              onChange={(e) => handleInputFile(e.target.files[0])}
            />
          </label>
          <button
            onClick={importBookmarks}
            className="inline-block rounded-md bg-slate-800 px-3 py-2 text-white "
          >
            Import
          </button>
        </section>
        <section className="flex flex-col items-start justify-center space-y-4 rounded-md bg-slate-50 p-4">
          <div className="flex items-center">
            <h2 className="text-lg text-slate-700">Export</h2>
            <span className="ml-4 text-slate-400">(Coming Soon)</span>
          </div>
          <label className="text-slate-500">
            Export your saved bookmarks from Briefkasten to a{' '}
            <code className="rounded-md bg-slate-200 py-1 px-2">
              bookmarks.html
            </code>{' '}
            file. This is a standardized bookmarks format which should work with
            any other bookmarks manager and most browsers.
          </label>
          <button
            onClick={exportBookmarks}
            className="rounded-md bg-slate-800 px-3 py-2 text-white "
          >
            Export
          </button>
        </section>
        <section className="flex flex-col items-start justify-center space-y-4 rounded-md bg-slate-50 p-4">
          <div className="flex items-center">
            <h2 className="text-lg text-slate-700">Manual Image Fetch</h2>
            <span className="ml-4 text-slate-400">(Coming Soon)</span>
          </div>
          <label className="text-slate-500">
            After importing a large amount of bookmarks, you can kick off a
            manual image fetch, which will tell our systems to go fetch images
            for all your new bookmarks. This is normally done on a regular basis
            every 24hrs any way, but you can initiate it now by clicking below.
          </label>
          <button
            onClick={enqueueImageFix}
            className="rounded-md bg-slate-800 px-3 py-2 text-white "
          >
            Enqueue Image Fix
          </button>
        </section>
        <section className="flex-1" />
        <section className="flex flex-col items-start justify-center space-y-4 rounded-md bg-slate-50 p-4">
          <h2 className="text-lg text-slate-700">About</h2>
          <label className="text-slate-500">
            This is an open-source project written mainly by{' '}
            <a
              href="https://ndo.dev?utm_source=briefkasten-about"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-600 hover:underline"
            >
              ndom91
            </a>
            . More information can be found at the links below.
          </label>
          <ul className="list-inside list-disc text-slate-500">
            <li>
              Repository:{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/ndom91/briefkasten"
                className="font-semibold text-slate-600 hover:underline"
              >
                <code>ndom91/briefkasten</code>
              </a>
            </li>
            <li>
              License:{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-600 hover:underline"
                href="https://github.com/ndom91/briefkasten/blob/main/LICENSE"
              >
                <code>MIT</code>
              </a>
            </li>
          </ul>
        </section>
      </main>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const nextauth = await getServerSession(context, authOptions)
  const zustandStore = initializeStore()

  if (!nextauth) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const bookmarkData = await prisma.bookmark.findMany({
    where: {
      userId: nextauth.user.userId,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  })

  const categories = await prisma.category.findMany({
    where: {
      userId: nextauth.user.userId,
    },
  })
  const tags = await prisma.tag.findMany({
    where: {
      userId: nextauth.user.userId,
    },
  })

  zustandStore.getState().setCategories(categories)
  zustandStore.getState().setTags(tags)
  zustandStore.getState().setBookmarks(bookmarkData)

  return {
    props: {
      nextauth,
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  }
}
