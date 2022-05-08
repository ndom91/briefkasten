export default function BookmarkCard({ bookmark }) {
  const { title, url, description, category } = bookmark;

  return (
    <div
      className="max-w-[250px] rounded overflow-hidden shadow-lg"
      key={bookmark.id}
    >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <div className="font-bold text-xl mb-2">{url}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {category.name}
        </span>
      </div>
    </div>
  );
}
