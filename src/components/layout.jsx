import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto grid h-full max-h-screen grid-cols-[minmax(6rem,16rem)_1fr] grid-rows-1 overflow-hidden">
        <Sidebar />
        <main className="max-h-screen overflow-y-scroll p-4">{children}</main>
      </section>
    </>
  )
}
