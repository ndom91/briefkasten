import Image from 'next/image'

export default function EmptyDashboard() {
  return (
    <section className="max-w-xl px-4 py-12 mx-auto flex flex-col items-center">
      <Image
        className="mx-auto object-cover"
        src="/images/empty-state.png"
        layout="fixed"
        height="500"
        width="500"
        alt="empty image"
      />
      <h2 className="mt-2 text-xl font-medium text-center text-gray-800">
        It looks like you don&apos;t have any bookmarks yet!
      </h2>
      <p className="mt-1 text-center text-gray-600">
        This is where you’ll manage your bookmarks. Get started by installing
        the{' '}
        <a
          href="https://chrome.google.com/webstore/detail/briefkasten-bookmarks/aighkhofochfjejmhjfkgjfpkpgmjlnd"
          className="underline"
        >
          extension
        </a>{' '}
        and adding bookmarks that way, or you can quick-add a bookmark by using
        the &quot;+&quot; button in the bottom right!
      </p>
      <div className="flex flex-col items-center justify-center mt-4 space-y-1 md:flex-row md:space-y-0 md:space-x-1">
        <a
          href="https://chrome.google.com/webstore/detail/briefkasten-bookmarks/aighkhofochfjejmhjfkgjfpkpgmjlnd"
          className="inline-flex transition justify-center py-2 px-6 shadow-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 text-md"
        >
          Install Extension
        </a>
      </div>
    </section>
  )
}
