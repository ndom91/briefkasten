import Link from 'next/link'

export default function Pagination() {
  return (
    <ol className="flex justify-center space-x-1 text-xs font-medium">
      <li>
        <Link
          href="/?page=1"
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </li>

      <li>
        <Link
          href="/?page=1"
          className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
        >
          1
        </Link>
      </li>

      <li className="block h-8 w-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white">
        2
      </li>

      <li>
        <Link
          href="/?page=3"
          className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
        >
          3
        </Link>
      </li>

      <li>
        <Link
          href="/?page=4"
          className="block h-8 w-8 rounded border border-gray-100 text-center leading-8"
        >
          4
        </Link>
      </li>

      <li>
        <Link
          href="/?page=3"
          className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </li>
    </ol>
  )
}
