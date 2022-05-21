import { useState } from 'react'
import { getServerSession } from 'next-auth/next'
import { useStore, initializeStore } from '@/lib/store'
import Head from 'next/head'
import Layout from '@/components/layout'
import Sidebar from '@/components/sidebar'
import TableRow from '@/components/tableRow'
import { authOptions } from './api/auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default function Tags() {
  const categories = useStore((state) => state.categories)
  const tags = useStore((state) => state.tags)
  const [tagName, setTagName] = useState('')
  const [tagEmoji, setTagEmoji] = useState('')

  const saveNewTag = () => {
    fetch('/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: tagName,
        emoji: tagEmoji,
      }),
    })
  }

  return (
    <Layout>
      <Head>
        <title>Briefkasten | Tags</title>
      </Head>
      <Sidebar categories={categories} tags={tags} />
      <div className="flex flex-col space-y-4">
        <div className="relative overflow-x-auto sm:rounded-lg">
          <div className="ml-1 mb-4">
            <label htmlFor="table" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-slate-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table"
                className="block w-80 rounded-lg border border-transparent bg-slate-50 p-2.5 pl-10 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
                placeholder="Search for items"
              />
            </div>
          </div>
          <table className="w-full text-left text-sm text-slate-500 ">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 ">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 bg-slate-100 text-slate-600 focus:ring-2 focus:ring-slate-500"
                    />
                    <label htmlFor="checkbox-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3" width="20%">
                  ID
                </th>
                <th scope="col" className="px-6 py-3" width="40%">
                  Name
                </th>
                <th scope="col" className="px-6 py-3" width="30%">
                  Emoji
                </th>
                <th scope="col" className="px-6 py-3" width="10%">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tags && tags.map((tag) => <TableRow tag={tag} key={tag.id} />)}
              <tr className="bg-white even:bg-gray-50 hover:bg-slate-100">
                <td className="w-4 p-4" />
                <th className={`px-6 py-2`}>
                  <span className="font-normal">Add new Tag</span>
                </th>
                <td className={`px-6 py-2`}>
                  <input
                    name="name"
                    value={tagName}
                    type="text"
                    onChange={(e) => setTagName(e.target.value)}
                    className="block rounded-lg border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
                  />
                </td>
                <td className={`px-6 py-2`}>
                  <input
                    name="emoji"
                    value={tagEmoji}
                    type="text"
                    onChange={(e) => setTagEmoji(e.target.value)}
                    className="block rounded-lg border-2 border-slate-200 bg-slate-50 py-1 px-2 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => saveNewTag()}
                    className="font-medium text-slate-600 outline-none hover:underline focus:underline focus:underline-offset-2"
                  >
                    Save
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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

  return {
    props: {
      nextauth,
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  }
}
