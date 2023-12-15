import Head from "next/head"
import { useState } from "react"
import { unstable_getServerSession } from "next-auth/next"

import Layout from "@/components/layout"
import TagTableRow from "@/components/tagTableRow"
import Breadcrumbs from "@/components/breadcrumbs"

import prisma from "@/lib/prisma"
import { useStore, initializeStore } from "@/lib/store"
import { useToast, toastTypes } from "@/lib/hooks"
import { authOptions } from "./api/auth/[...nextauth]"

const breadcrumbs = [
  {
    name: "Dashboard",
    icon: `<svg className="h-4 w-4 shrink-0" aria-hidden="true" viewBox="0 0 256 256" > <path d="M184,32H72A16,16,0,0,0,56,48V224a8.1,8.1,0,0,0,4.1,7,7.6,7.6,0,0,0,3.9,1,7.9,7.9,0,0,0,4.2-1.2L128,193.4l59.7,37.4a8.3,8.3,0,0,0,8.2.2,8.1,8.1,0,0,0,4.1-7V48A16,16,0,0,0,184,32Z"></path> </svg>`,
  },
  {
    name: "Tags",
    icon: `<svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>`,
  },
]

export default function Tags({ nextauth }) {
  const addTag = useStore((state) => state.addTag)
  const [tagName, setTagName] = useState("")
  const [tagEmoji, setTagEmoji] = useState("")
  const toast = useToast(5000)

  const [searchString, setSearchString] = useState("")
  const tags = useStore((state) => {
    if (!searchString) {
      return state.tags
    }
    return state.tags.filter((tag) => tag.name.toLowerCase().includes(searchString.toLowerCase()))
  })

  const saveNewTag = async () => {
    try {
      if (tagName.length > 190 || tagEmoji.length > 190) {
        toast(toastTypes.WARNING, "Name or emoji too long")
        return
      }
      const addRes = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tagName,
          emoji: tagEmoji,
          userId: nextauth.user?.userId,
        }),
      })
      if (addRes.status === 200) {
        const addData = await addRes.json()
        addTag(addData.data)
        setTagName("")
        setTagEmoji("")
        toast(toastTypes.SUCCESS, `Successfully saved "${tagName}"`)
      }
    } catch (error) {
      console.error(error)
      toast(toastTypes.ERROR, `Error saving ${tagName}`)
    }
  }

  return (
    <Layout session={nextauth}>
      <Head>
        <title>Briefkasten | Tags</title>
      </Head>
      <div className="flex h-full flex-col items-center space-y-2">
        <div className="flex w-full items-center justify-start space-x-4 p-6">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
          <div className="flex w-full justify-center">
            <label htmlFor="table" className="sr-only">
              Search
            </label>
            <div className="relative mt-1 flex w-full justify-center">
              <div className="pointer-events-none relative inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="pointer-events-none absolute left-5 top-2 h-5 w-5 text-slate-200"
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
              </div>
              <input
                type="text"
                id="table"
                onChange={(e) => setSearchString(e.target.value)}
                className="w-2/3 rounded-md border-2 border-slate-200 py-1 px-2 pl-8 pr-8 text-base text-slate-600 outline-none placeholder:text-slate-200 focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent"
                placeholder="Search for items"
              />
            </div>
          </div>
        </div>
        <div className="relative w-full overflow-y-scroll px-4">
          <table className="w-full text-left text-sm text-slate-500 ">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700 ">
              <tr>
                <th scope="col" className="px-6 py-3" width="12%">
                  ID
                </th>
                <th scope="col" className="px-6 py-3" width="5%">
                  Count
                </th>
                <th scope="col" className="px-6 py-3" width="30%">
                  Name
                </th>
                <th scope="col" className="px-6 py-3" width="12%">
                  Emoji
                </th>
                <th scope="col" className="px-6 py-3" width="25%">
                  Date Added
                </th>
                <th scope="col" className="px-6 py-3" width="23%">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tags?.map((tag) => (
                <TagTableRow item={tag} key={tag.id} />
              ))}
              <tr className="bg-white even:bg-gray-50 hover:bg-slate-100">
                <td className={"px-6 py-2"}>
                  <span className="font-semibold">Add new Tag</span>
                </td>
                <td className={"px-6 py-2"} />
                <td className={"px-6 py-2"}>
                  <input
                    name="name"
                    value={tagName}
                    type="text"
                    placeholder="Required"
                    onChange={(e) => setTagName(e.target.value)}
                    className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
                  />
                </td>
                <td className={"px-6 py-2"}>
                  <input
                    name="emoji"
                    value={tagEmoji}
                    type="text"
                    placeholder="Optional"
                    onChange={(e) => setTagEmoji(e.target.value)}
                    className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 py-1 px-2 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => saveNewTag()}
                    className="flex items-center justify-center space-x-1 rounded-md bg-slate-700 py-1 px-2 pr-3 font-medium text-white outline-none"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Save</span>
                  </button>
                </td>
                <td className={"px-6 py-2"} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  const zustandStore = initializeStore()

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.userId,
    },
  })
  const tags = await prisma.tag.findMany({
    where: {
      userId: session.user.userId,
    },
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: { bookmarks: true },
      },
    },
  })

  zustandStore.getState().setCategories(categories)
  zustandStore.getState().setTags(tags)

  return {
    props: {
      session,
      nextauth: session,
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  }
}
