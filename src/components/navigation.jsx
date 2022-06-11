import Link from 'next/link'
import Image from 'next/image'
import { useStore } from '@/lib/store'
import { useKeyPress } from 'react-use'
import { useState, useRef } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  const searchText = useStore((state) => state.searchText)
  const setSearchText = useStore((state) => state.setSearchText)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef()

  useKeyPress((e) => {
    if (e.type === 'keydown') {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        searchRef?.current?.focus()
      }
    }
  })

  const signinHandler = () => {
    if (session?.user?.image) {
      signOut()
    } else {
      signIn()
    }
  }

  return (
    <nav className="mt-2 flex items-center justify-between bg-white py-4 px-4">
      <li>
        <div className="relative flex w-full items-center justify-start">
          <svg
            className="pointer-events-none absolute left-2 top-2 h-5 w-5 text-slate-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {!searchFocused && searchText.length === 0 ? (
            <div className="pointer-events-none absolute left-8 top-[0.65rem] z-10 hidden text-xs text-slate-400 opacity-50 lg:inline-block">
              <span className="rounded-md bg-slate-200 p-1 px-2 ">
                <kbd className="">ctrl</kbd>
                <span> + </span>
                <kbd className="">k</kbd>
              </span>
              <span> to search</span>
            </div>
          ) : null}
          <input
            ref={searchRef}
            type="text"
            value={searchText}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-md border-2 border-slate-200 py-1 px-2 pl-8 pr-8 text-base text-slate-600 outline-none placeholder:text-slate-200 focus:border-slate-200 focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent"
          />
          {searchText.length ? (
            <svg
              className="absolute right-1.5 top-1.5 h-6 w-6 text-rose-300 hover:cursor-pointer"
              onClick={() => setSearchText('')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : null}
        </div>
      </li>
      <nav className="flex flex-wrap items-center justify-center space-x-2 text-base md:ml-auto md:space-x-8">
        <Link href="/categories" passHref>
          <a className="rounded font-serif outline-none transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-slate-200 hover:ring-offset-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent sm:p-2">
            Categories
          </a>
        </Link>
        <Link href="/tags" passHref>
          <a className="rounded font-serif outline-none transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-slate-200 hover:ring-offset-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent sm:p-2">
            Tags
          </a>
        </Link>
        <Link href="/settings" passHref>
          <a className="rounded font-serif outline-none transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-slate-200 hover:ring-offset-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent sm:p-2">
            Settings
          </a>
        </Link>
        <button
          onClick={() => signinHandler()}
          className="inline-flex items-center rounded border-0 bg-gray-100 px-3 py-1 text-base transition duration-300 ease-in-out hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white md:mt-0"
        >
          {session && (
            <Image
              alt="User Profile Pic"
              src={
                session?.user?.image ??
                'https://source.boringavatars.com/beam/4'
              }
              width="32"
              height="32"
              className="h-6 w-6 rounded-full py-4"
            />
          )}
          <span className="my-2 ml-4 font-serif">
            {!session ? 'Login' : 'Logout'}
          </span>
        </button>
      </nav>
    </nav>
  )
}
