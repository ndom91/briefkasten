import Link from 'next/link'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  const signinHandler = () => {
    if (session?.user?.image) {
      signOut()
    } else {
      signIn()
    }
  }

  return (
    <nav className="flex items-center bg-white py-4 px-4">
      <Link href="/" passHref>
        <div className="flex items-center hover:cursor-pointer ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-10 w-10 rounded-full bg-slate-800 p-2 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Briefkasten</span>
        </div>
      </Link>
      <nav className="flex flex-wrap items-center justify-center space-x-8 text-base md:ml-auto">
        <Link href="/categories" passHref>
          <a className="rounded p-2 outline-none transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-slate-200 hover:ring-offset-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent">
            Categories
          </a>
        </Link>
        <Link href="/tags" passHref>
          <a className="rounded p-2 outline-none transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-slate-200 hover:ring-offset-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent">
            Tags
          </a>
        </Link>
        <Link href="/settings" passHref>
          <a className="rounded p-2 outline-none transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-slate-200 hover:ring-offset-transparent focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-transparent">
            Settings
          </a>
        </Link>
        <button
          onClick={() => signinHandler()}
          className="mt-4 inline-flex items-center rounded border-0 bg-gray-100 px-3 py-1 text-base transition duration-300 ease-in-out hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 focus:ring-offset-white md:mt-0"
        >
          {session && (
            <Image
              alt="User Profile Pic"
              src={session.user.image}
              width="32"
              height="32"
              className="h-6 w-6 rounded-full py-4"
            />
          )}
          <span className="my-2 ml-4">{!session ? 'Login' : 'Logout'}</span>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="ml-1 h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </nav>
    </nav>
  )
}
