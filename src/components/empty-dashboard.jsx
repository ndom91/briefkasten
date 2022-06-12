import Image from 'next/image'

export default function EmptyDashboard() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-12">
      <Image
        className="mx-auto object-cover"
        src="/images/empty-state.png"
        layout="fixed"
        height="500"
        width="500"
        alt="empty image"
      />
      <h2 className="mt-2 text-center text-xl font-medium text-gray-800">
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
      <div className="mt-4 flex flex-col items-center justify-center space-y-1 md:flex-row md:space-y-0 md:space-x-1">
        <a
          href="https://chrome.google.com/webstore/detail/briefkasten-bookmarks/aighkhofochfjejmhjfkgjfpkpgmjlnd"
          className="text-md inline-flex justify-center rounded-md bg-slate-800 py-2 px-6 font-medium text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          Install Extension
        </a>
      </div>
    </section>
  )
}
