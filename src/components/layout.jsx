import Meta from '@/components/meta'
import Sidebar from '@/components/sidebar'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto flex h-full overflow-hidden">
        <Sidebar />
        <main className="w-full">{children}</main>
      </section>
    </>
  )
}
