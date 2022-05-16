export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-6 sm:items-start">
        {/* <a href="#" className="flex items-center hover:cursor-pointer ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 p-2 text-white rounded-full bg-slate-800"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="text-base">Briefkasten</span>
        </a> */}
        <nav className="mt-6 flex items-center space-x-3">
          <a
            href="#"
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
            href="#"
            className="rounded-lg bg-gray-100 p-1 text-gray-500 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white"
          >
            <svg name="youtube" className="h-6 w-6" viewBox="0 0 512 512">
              <path
                d="m427 169c-4-15-17-27-32-31-34-9-239-10-278 0-15 4-28 16-32 31-9 38-10 135 0 174 4 15 17 27 32 31 36 10 241 10 278 0 15-4 28-16 32-31 9-36 9-137 0-174"
                fill="currentColor"
              ></path>
              <path d="m220 203v106l93-53" fill="white"></path>
            </svg>
          </a>
          <a
            href="#"
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
            href="#"
            className="rounded-lg bg-gray-100 p-1 text-gray-500 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 focus:ring-offset-white"
          >
            <svg
              name="discord"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path
                d="m386 137c-24-11-49.5-19-76.3-23.7c-.5 0-1 0-1.2.6c-3.3 5.9-7 13.5-9.5 19.5c-29-4.3-57.5-4.3-85.7 0c-2.6-6.2-6.3-13.7-10-19.5c-.3-.4-.7-.7-1.2-.6c-23 4.6-52.4 13-76 23.7c-.2 0-.4.2-.5.4c-49 73-62 143-55 213c0 .3.2.7.5 1c32 23.6 63 38 93.6 47.3c.5 0 1 0 1.3-.4c7.2-9.8 13.6-20.2 19.2-31.2c.3-.6 0-1.4-.7-1.6c-10-4-20-8.6-29.3-14c-.7-.4-.8-1.5 0-2c2-1.5 4-3 5.8-4.5c.3-.3.8-.3 1.2-.2c61.4 28 128 28 188 0c.4-.2.9-.1 1.2.1c1.9 1.6 3.8 3.1 5.8 4.6c.7.5.6 1.6 0 2c-9.3 5.5-19 10-29.3 14c-.7.3-1 1-.6 1.7c5.6 11 12.1 21.3 19 31c.3.4.8.6 1.3.4c30.6-9.5 61.7-23.8 93.8-47.3c.3-.2.5-.5.5-1c7.8-80.9-13.1-151-55.4-213c0-.2-.3-.4-.5-.4Zm-192 171c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38zm125 0c-19 0-34-17-34-38c0-21 15-38 34-38c19 0 34 17 34 38c0 21-15 38-34 38z"
                fill="currentColor"
              ></path>
            </svg>
          </a>
        </nav>
        <nav className="mt-6 flex w-full flex-col-reverse items-center justify-between space-y-4 space-y-reverse text-xs font-medium text-gray-500 sm:flex-row sm:space-y-0">
          <p>
            <a
              href="https://github.com/ndom91"
              alt="ndom91 Github Profile"
              target="_blank"
              rel="noopener noreferer noreferrer"
            >
              .domino 2022
            </a>
          </p>
          {/* © | All Rights Reserved.</p> */}
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
