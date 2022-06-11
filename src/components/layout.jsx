import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto grid h-full max-h-screen grid-cols-[minmax(150px,_15%)_1fr] grid-rows-1 gap-2 md:gap-4 overflow-hidden">
        <Sidebar />
        <main className="max-h-screen overflow-y-scroll p-4">{children}</main>
      </section>
    </>
  )
}
