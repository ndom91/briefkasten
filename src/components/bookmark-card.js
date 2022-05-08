export default function BookmarkCard({ bookmark }) {
  const { title, url, description, category } = bookmark

  return (
    <div
      className="max-w-[250px] overflow-hidden rounded shadow-lg"
      key={bookmark.id}
    >
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{title}</div>
        <div className="mb-2 text-xl font-bold">{url}</div>
        <p className="text-base text-gray-700">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          {category.name}
        </span>
      </div>
    </div>
  )
}
