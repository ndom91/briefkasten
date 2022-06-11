import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto h-full flex overflow-hidden">
        <Sidebar />
        <main className="p-4">{children}</main>
      </section>
    </>
  )
}
