export default function EmptyDashboard() {
  return (
    <section className="mx-auto flex w-2/3 max-w-xl flex-col items-center px-4 lg:py-12">
      {/* eslint-disable @next/next/no-img-element */}
      <img
        className="mx-auto w-1/2 object-cover lg:w-4/5 lg:p-8 2xl:h-full"
        src="/images/empty-state.png"
        alt="empty image"
      />
      <h2 className="mt-2 text-center text-xl font-medium text-gray-800">
        It looks like you don&apos;t have any bookmarks yet!
      </h2>
      <p className="mt-4 text-center text-gray-600">
        This is where you’ll manage your items. Get started by installing the{' '}
        <a
          href="https://chrome.google.com/webstore/detail/briefkasten-bookmarks/aighkhofochfjejmhjfkgjfpkpgmjlnd"
          className="underline"
        >
          extension
        </a>
        .
      </p>
      <p className="mt-1 text-center text-gray-600">
        Alternatively, you can also add bookmarks in the following ways:
      </p>
      <ul className="mt-2 list-inside list-disc text-gray-600">
        <li>
          <strong>Drag-and-drop</strong> URLs anywhere onto the page
        </li>
        <li className="invisible md:visible">
          Use the <strong>quick-add button</strong> in the bottom right corner
        </li>
      </ul>
      <div className="mt-4 flex flex-col items-center justify-center space-y-1 md:flex-row md:space-y-0 md:space-x-1">
        <a
          href="https://chrome.google.com/webstore/detail/briefkasten-bookmarks/aighkhofochfjejmhjfkgjfpkpgmjlnd"
          className="text-md inline-flex justify-center rounded-md bg-slate-800 py-2 px-6 font-medium text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          Install Extension
        </a>
      </div>
      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/images/arrow.svg"
        alt="arrow blob"
        aria-hidden="true"
        className="absolute bottom-24 right-72 hidden rotate-[55deg] 2xl:block"
      />
    </section>
  )
}
