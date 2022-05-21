import Link from 'next/link'

export default function Sidebar({ categories, tags }) {
  const toggleModal = (type, action) => {
    console.log('TOGGLEMODAL', type, action)
    if (type === 'category') {
      if (action === 'add') {
      }
    } else if (type === 'tag') {
      if (action === 'add') {
      }
    }
  }
  return (
    <aside className="mx-4 flex flex-col space-y-4 rounded-lg bg-slate-50 p-6">
      <div className="flex flex-1 flex-col space-y-6">
        <div>
          <Link href="/">
            <div className="flex items-center justify-start space-x-2 hover:cursor-pointer">
              <svg
                className="h-6 w-6 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-lg text-slate-600">Home</span>
            </div>
          </Link>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-start space-x-2">
            <svg
              className="h-6 w-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-lg text-slate-600">Categories</h2>
            <div className="flex flex-1 justify-end hover:cursor-pointer">
              <svg
                className="h-6 w-6 text-slate-300"
                onClick={() => toggleModal('category', 'add')}
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
            </div>
          </div>
          <div className="ml-4 flex flex-col space-y-2">
            {categories?.map((cat) => {
              return (
                <Link
                  href={`/categories/${cat.name.toLowerCase()}`}
                  key={cat.name}
                  passHref
                >
                  <a className="text-slate-400">{cat.name}</a>
                </Link>
              )
            })}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-start space-x-2">
            <svg
              className="h-6 w-6 text-slate-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <h2 className="text-lg text-slate-600">Tags</h2>
            <div className="flex flex-1 justify-end hover:cursor-pointer">
              <svg
                className="h-6 w-6 text-slate-300"
                onClick={() => toggleModal('tag', 'add')}
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
            </div>
          </div>
          <div className="ml-4 flex flex-col space-y-2">
            {tags?.map((tag) => {
              return (
                <Link
                  href={`/tags/${tag.name.toLowerCase()}`}
                  passHref
                  key={tag.name}
                >
                  <a className="text-slate-400">
                    {tag.emoji}
                    <span className="ml-2">{tag.name}</span>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      <p className="text-center text-sm italic tracking-tight text-slate-300">
        Click to filter the view of saved bookmarks
      </p>
    </aside>
  )
}
