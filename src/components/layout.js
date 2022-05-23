import Meta from '@/components/meta'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

export default function Layout({ children }) {
  return (
    <>
      <Meta />
      <section className="mx-auto grid min-h-screen max-w-8xl grid-rows-[auto_1fr_auto] gap-2 px-2 md:gap-4 md:px-4">
        <Navigation />
        <main className="grid grid-cols-[minmax(150px,_25%)_1fr]">
          {children}
        </main>
        <Footer />
      </section>
    </>
  )
}
