export default function BookmarkCard({ bookmark }) {
  const { title, url, description, category, tags } = bookmark

  return (
    <div
      className="h-fit max-w-[250px] overflow-hidden rounded shadow-lg"
      key={bookmark.id}
    >
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{title}</div>
        <div className="mb-2 truncate text-sm font-light">{url}</div>
        <p className="text-base text-gray-700">{description}</p>
        <p className="text-base text-gray-700">{category?.name}</p>
      </div>
      {tags.length > 0 ? (
        <div className="px-6 pt-2 pb-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : (
        <div />
      )}
    </div>
  )
}
