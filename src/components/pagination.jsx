import { usePagination, DOTS } from '../lib/hooks'

export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
    document
      .querySelectorAll('.bookmark-card')[0]
      ?.scrollIntoView(true, { behavior: 'smooth' })
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
    document
      .querySelectorAll('.bookmark-card')[0]
      ?.scrollIntoView(true, { behavior: 'smooth' })
  }

  let lastPage = paginationRange[paginationRange.length - 1]

  return (
    <div className="absolute bottom-4 z-50 flex w-full items-center justify-between px-4 py-3 sm:w-fit sm:px-6">
      <div className="flex flex-1 justify-between px-4 sm:hidden">
        <a
          href="#"
          onClick={onPrevious}
          className={`relative inline-flex w-1/2 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === 1
              ? 'pointer-events-none !bg-slate-50 !text-slate-400 hover:cursor-default'
              : ''
          } `}
        >
          Previous
        </a>
        <a
          href="#"
          onClick={onNext}
          className={`relative ml-3 inline-flex w-1/2 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
            currentPage === lastPage
              ? 'pointer-events-none !bg-slate-50 !text-slate-400 hover:cursor-default'
              : ''
          } `}
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* <div> */}
        {/*   <p className="text-sm text-gray-700"> */}
        {/*     Showing <span className="font-medium">1</span> to{' '} */}
        {/*     <span className="font-medium">10</span> of{' '} */}
        {/*     <span className="font-medium">97</span> results */}
        {/*   </p> */}
        {/* </div> */}
        <div className="rounded-md shadow-xl shadow-black/30">
          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md shadow-xl"
            aria-label="Pagination"
          >
            <a
              href="#"
              onClick={onPrevious}
              className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                currentPage === 1
                  ? 'pointer-events-none !bg-slate-50 !text-slate-400 hover:cursor-default'
                  : ''
              } `}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </a>

            {paginationRange.map((pageNumber, i) => {
              if (pageNumber === DOTS) {
                return (
                  <span
                    key={`${pageNumber}-${i}`}
                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    &#8230;
                  </span>
                )
              }

              return (
                <a
                  href="#"
                  key={`${pageNumber}-${i}`}
                  aria-current="page"
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative z-10 inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 ${
                    pageNumber === currentPage
                      ? '!bg-slate-800 text-slate-50'
                      : ''
                  } `}
                >
                  {pageNumber}
                </a>
              )
            })}
            <a
              href="#"
              onClick={onNext}
              className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                currentPage === lastPage
                  ? 'pointer-events-none !bg-slate-50 !text-slate-400 hover:cursor-default'
                  : ''
              } `}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}
