import Head from 'next/head'
import Script from 'next/script'

const Meta = () => {
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
        <meta property="og:url" content="https://briefkasten.vercel.app" />
        <meta property="og:image" content={''} />
        <meta name="twitter:image" content={''} />
        <title>Briefkasten</title>
      </Head>
      {process.env.NODE_ENV === 'production' && (
        <Script
          src="/p.js"
          data-domain="briefkasten.vercel.app"
          data-api="/a/e"
        />
      )}
    </>
  )
}

export default Meta
