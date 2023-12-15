import BookmarkTableRow from "@/components/bookmarkTableRow"

export default function DataTable({ items, initEdit }) {
  return (
    <table className="mb-16 w-full rounded-t-lg text-left text-sm text-slate-500">
      <thead className="rounded-t-lg bg-slate-50 text-xs uppercase text-slate-700 ">
        <tr>
          <th scope="col" className="w-8" width="20px">
            <div className="w-12" />
          </th>
          <th scope="col" className="px-6 py-3" width="20%">
            Title
          </th>
          <th scope="col" className="px-6 py-3" width="20%">
            URL
          </th>
          <th scope="col" className="px-6 py-3" width="25%">
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
          <th scope="col" className="px-6 py-3" width="6%">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items?.map((bookmark) => (
          <BookmarkTableRow
            item={bookmark}
            key={bookmark.id}
            toggleSidebar={() => initEdit(bookmark)}
          />
        ))}
      </tbody>
    </table>
  )
}
