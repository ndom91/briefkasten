import BookmarkTableRow from '@/components/bookmarkTableRow'

export default function DataTable({ items }) {
  return (
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
          <th scope="col" className="px-6 py-3" width="5">
            ID
          </th>
          <th scope="col" className="px-6 py-3" width="10%">
            Title
          </th>
          <th scope="col" className="px-6 py-3" width="10%">
            URL
          </th>
          <th scope="col" className="px-6 py-3" width="15%">
            Description
          </th>
          <th scope="col" className="px-6 py-3" width="10%">
            Category
          </th>
          <th scope="col" className="px-6 py-3" width="10%">
            Tags
          </th>
          <th scope="col" className="px-6 py-3" width="10%">
            Date Added
          </th>
          <th scope="col" className="px-6 py-3" width="23%">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items &&
          items.map((category) => (
            <BookmarkTableRow item={category} key={category.id} />
          ))}
        {/* <tr className="bg-white even:bg-gray-50 hover:bg-slate-100"> */}
        {/*   <td className="w-4 p-4" /> */}
        {/*   <th className={`px-6 py-2`}> */}
        {/*     <span className="font-normal">Add new Category</span> */}
        {/*   </th> */}
        {/*   <td className={`px-6 py-2`}> */}
        {/*     <input */}
        {/*       name="name" */}
        {/*       value={categoryName} */}
        {/*       type="text" */}
        {/*       onChange={(e) => setCategoryName(e.target.value)} */}
        {/*       className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 p-2 py-1 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500  focus:ring-slate-500 " */}
        {/*     /> */}
        {/*   </td> */}
        {/*   <td className={`px-6 py-2`}> */}
        {/*     <input */}
        {/*       name="emoji" */}
        {/*       value={categoryDesc} */}
        {/*       type="text" */}
        {/*       onChange={(e) => setCategoryDesc(e.target.value)} */}
        {/*       className="block w-full rounded-md border-2 border-slate-200 bg-slate-50 py-1 px-2 text-sm text-slate-900 placeholder-slate-300 focus:border-slate-500 focus:ring-slate-500" */}
        {/*     /> */}
        {/*   </td> */}
        {/*   <td className="px-6 py-4 text-right"> */}
        {/*     <button */}
        {/*       onClick={() => saveNewCategory()} */}
        {/*       className="flex items-center justify-center space-x-1 rounded-md bg-slate-700 py-1 px-2 pr-3 font-medium text-white outline-none" */}
        {/*     > */}
        {/*       <svg */}
        {/*         className="h-6 w-6" */}
        {/*         fill="none" */}
        {/*         stroke="currentColor" */}
        {/*         viewBox="0 0 24 24" */}
        {/*         xmlns="http://www.w3.org/2000/svg" */}
        {/*       > */}
        {/*         <path */}
        {/*           strokeLinecap="round" */}
        {/*           strokeLinejoin="round" */}
        {/*           strokeWidth={2} */}
        {/*           d="M12 6v6m0 0v6m0-6h6m-6 0H6" */}
        {/*         /> */}
        {/*       </svg> */}
        {/*       <span>Save</span> */}
        {/*     </button> */}
        {/*   </td> */}
        {/* </tr> */}
      </tbody>
    </table>
  )
}
