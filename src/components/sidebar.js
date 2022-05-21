import Link from 'next/link'

export default function Sidebar({ categories, tags }) {
  return (
    <aside className="mx-4 space-y-4 rounded-lg bg-slate-50 p-4">
      <p className="text-sm italic tracking-tight text-slate-300">
        Click to filter the view of saved bookmarks
      </p>
      <div>
        <h2 className="font-semibold uppercase">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories?.map((cat) => {
            return (
              <Link
                href={`/categories/${cat.name.toLowerCase()}`}
                key={cat.name}
                passHref
              >
                <a className="text-slate-400 first-letter:font-bold">
                  {cat.name}
                </a>
              </Link>
            )
          })}
        </div>
      </div>
      <div>
        <h2 className="font-semibold uppercase">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => {
            return (
              <Link
                href={`/tags/${tag.name.toLowerCase()}`}
                passHref
                key={tag.name}
              >
                <a
                  className="py rounded-md px-2 text-white first-letter:font-bold"
                  style={{
                    backgroundColor: tag.color,
                  }}
                >
                  {tag.name}
                </a>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
