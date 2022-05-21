export default function Footer() {
  return (
    <footer className="px-4">
      <div className="flex w-full max-w-7xl flex-col items-center py-6 sm:items-start">
        <nav className="mt-6 flex items-center space-x-3">
          <a
            href="https://twitter.com/ndom91"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-100 p-1 text-gray-500 outline-none transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white"
          >
            <svg name="twitter" className="h-6 w-6" viewBox="0 0 512 512">
              <path
                fill="currentColor"
                d="M437 152a72 72 0 01-40 12a72 72 0 0032-40a72 72 0 01-45 17a72 72 0 00-122 65a200 200 0 01-145-74a72 72 0 0022 94a72 72 0 01-32-7a72 72 0 0056 69a72 72 0 01-32 1a72 72 0 0067 50a200 200 0 01-105 29a200 200 0 00309-179a200 200 0 0035-37"
              ></path>
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/ndom91"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-100 p-1 text-gray-500 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white"
          >
            <svg
              name="linkedin"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <circle cx="142" cy="138" r="37"></circle>
              <path
                stroke="currentColor"
                strokeWidth="66"
                d="M244 194v198M142 194v198"
              ></path>
              <path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32"></path>
            </svg>
          </a>
          <a
            href="https://github.com/ndom91/briefkasten"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-100 p-1 text-gray-500 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white"
          >
            <svg
              name="github"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                fill="currentColor"
                d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
              />
            </svg>
          </a>
        </nav>
        <nav className="mt-6 flex w-full flex-col-reverse items-center justify-between space-y-4 space-y-reverse text-xs font-medium text-gray-500 sm:flex-row sm:space-y-0">
          <p>
            <a
              href="https://github.com/ndom91"
              alt="ndom91 Github Profile"
              target="_blank"
              rel="noopener noreferrer"
            >
              .<span className="font-extrabold">domino</span>{' '}
              <span className="">2022</span>
            </a>
          </p>
          <p>
            <a
              href="#"
              className="hover:underline focus:underline focus:outline-none"
            >
              Privacy
            </a>{' '}
            |{' '}
            <a
              href="#"
              className="hover:underline focus:underline focus:outline-none"
            >
              Terms
            </a>
          </p>
        </nav>
      </div>
    </footer>
  )
}
