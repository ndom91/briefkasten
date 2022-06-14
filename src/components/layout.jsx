import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto flex h-full overflow-hidden selection:bg-slate-800 selection:text-white">
        <Sidebar />
        <main className="w-full">{children}</main>
        <div className="pattern fixed top-0 left-0 -z-[1] h-full w-full" />
      </section>
    </>
  )
}
