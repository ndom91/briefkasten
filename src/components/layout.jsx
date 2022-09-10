import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'
import * as Sentry from '@sentry/nextjs'

export default function Layout({ children, session }) {
  if (session?.user) {
    const { email, userId, name } = session
    Sentry.setUser({ id: userId, email, name })
  }
  return (
    <>
      <Meta />
      <section className="mx-auto flex h-full max-w-full items-stretch overflow-hidden selection:bg-slate-800 selection:text-white">
        <Sidebar session={session} />
        <main className="flex flex-1">{children}</main>
      </section>
      <div className="pattern fixed top-0 left-0 -z-[1] h-full w-full" />
    </>
  )
}
