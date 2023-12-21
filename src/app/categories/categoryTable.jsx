"use client"

import { useEffect, useState } from "react"

import { SubmitButton } from "./submitButton"
import CategoryTableRow from "@/components/categoryTableRow"
import Breadcrumbs from "@/components/breadcrumbs"
import { createCategory } from "./actions"
import { useToast, toastTypes } from "@/lib/hooks"

const breadcrumbs = [
  {
    name: "Dashboard",
    icon: `<svg className="h-4 w-4 shrink-0" aria-hidden="true" viewBox="0 0 256 256" > <path d="M184,32H72A16,16,0,0,0,56,48V224a8.1,8.1,0,0,0,4.1,7,7.6,7.6,0,0,0,3.9,1,7.9,7.9,0,0,0,4.2-1.2L128,193.4l59.7,37.4a8.3,8.3,0,0,0,8.2.2,8.1,8.1,0,0,0,4.1-7V48A16,16,0,0,0,184,32Z"></path> </svg>`,
  },
  {
    name: "Categories",
    icon: `<svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
  },
]

export default function CategoryTable({ categories, userId }) {
  // const toast = useToast(5000)
  const createCategoryWithUser = createCategory.bind(null, userId)
  const [searchString, setSearchString] = useState("")
  const [filteredCategories, setFilteredCategories] = useState(categories)

  // Filter search results
  useEffect(() => {
    if (searchString) {
      setFilteredCategories(
        categories
          .map((cat) => {
            if (
              cat.name.includes(searchString) ||
              cat.description?.toLowerCase().includes(searchString.toLowerCase())
            ) {
              return cat
            }
          })
          .filter(Boolean),
      )
    } else {
      setFilteredCategories(categories)
    }
  }, [searchString, categories])

  return (
    <>
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
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="w-2/3 rounded-md border-2 border-slate-200 px-2 py-1 pl-8 pr-8 text-base text-slate-600 outline-none placeholder:text-slate-200 focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent"
              placeholder="Search for items"
            />
          </div>
        </div>
      </div>
      <form>
        <div className="relative w-full overflow-y-scroll px-4">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3" width="12%">
                  ID
                </th>
                <th scope="col" className="px-6 py-3" width="5%">
                  Count
                </th>
                <th scope="col" className="px-6 py-3" width="20%">
                  Name
                </th>
                <th scope="col" className="px-6 py-3" width="25%">
                  Description
                </th>
                <th scope="col" className="px-6 py-3" width="20%">
                  Date Added
                </th>
                <th scope="col" className="px-6 py-3" width="23%">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories?.map((category) => (
                <CategoryTableRow item={category} key={category.id} userId={userId} />
              ))}
              <tr className="bg-white even:bg-gray-50 hover:bg-slate-100">
                <td className={`px-6 py-2`}>
                  <span className="font-semibold">Add new Category</span>
                </td>
                <td className={`px-6 py-2`} />
                <td className={`px-6 py-2`}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    required
                    maxLength="190"
                    className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 "
                  />
                </td>
                <td className={`px-6 py-2`} colSpan="2">
                  <input
                    name="description"
                    type="text"
                    placeholder="Description"
                    maxLength="190"
                    className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <SubmitButton action={createCategoryWithUser} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </>
  )
}
