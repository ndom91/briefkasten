import React from 'react'
import { usePagination, DOTS } from '../lib/hooks'

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
}) => {
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
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange[paginationRange.length - 1]
  return (
    <ul
      className={`mt-4 flex list-none items-center justify-center ${
        className ? className : ''
      }`}
    >
      <li
        className={`my-1 flex h-8 items-center rounded-md py-4 text-center tracking-tight text-slate-400 transition hover:cursor-pointer hover:bg-slate-100 ${
          currentPage === 1 ? 'pointer-events-none hover:cursor-default' : ''
        }`}
        onClick={onPrevious}
      >
        <svg
          className="h-6 w-6 text-slate-800"
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
      </li>
      {paginationRange.map((pageNumber, i) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li
              key={`${pageNumber}-${i}`}
              className="my-1 flex h-8 items-center rounded-md py-4 text-center tracking-tight text-slate-800 hover:cursor-default"
            >
              &#8230;
            </li>
          )
        }

        return (
          <li
            key={`${pageNumber}-${i}`}
            className={`m-0.5 flex h-8 items-center rounded-md px-2 py-4 text-center tracking-tight text-slate-400 transition hover:cursor-pointer hover:bg-slate-100 ${
              pageNumber === currentPage ? 'bg-slate-800 text-slate-50' : ''
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        )
      })}
      <li
        className={`my-1 flex h-8 items-center rounded-md py-4 text-center tracking-tight text-slate-400 transition hover:cursor-pointer hover:bg-slate-100 ${
          currentPage === lastPage
            ? 'pointer-events-none hover:cursor-default'
            : ''
        }`}
        onClick={onNext}
      >
        <svg
          className="h-6 w-6 text-slate-800"
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
      </li>
    </ul>
  )
}

export default Pagination
