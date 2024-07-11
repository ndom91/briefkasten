import Head from 'next/head'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const Meta = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (window.location.host === 'briefkastenhq.com') {
      Swetrix.init(process.env.NEXT_PUBLIC_SWETRIX_PROJECT, {
        apiURL: process.env.NEXT_PUBLIC_SWETRIX_API_HOST,
      })
      let url = pathname
      Swetrix.trackPageview(url)
    }
  }, [pathname])

  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#1E293B"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#1E293B" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />

        <meta name="apple-mobile-web-app-title" content="Briefkasten" />
        <meta name="application-name" content="Briefkasten" />
        <meta name="theme-color" content="#1E293B" />

        <meta property="og:title" content="Briefkasten" />
        <meta property="og:description" content="Briefkasten - Bookmarks" />
        <meta property="og:url" content="https://briefkastenhq.com" />
        <meta property="og:image" content={''} />
        <meta name="twitter:image" content={''} />
        <meta name="darkreader-lock" />
        <title>Briefkasten</title>
      </Head>
    </>
  )
}

export default Meta
