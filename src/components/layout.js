import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'
// import Navigation from '@/components/navigation'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto grid max-h-screen grid-cols-[minmax(150px,_15%)_1fr] grid-rows-[auto] gap-2 md:gap-4 overflow-hidden">
        <Sidebar />
        <main className="max-h-screen overflow-y-scroll p-4">{children}</main>
      </section>
    </>
  )
}
