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
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#FCE7F3" />

        <meta property="og:title" content="Briefkasten" />
        <meta property="og:description" content="Briefkasten - Bookmarks" />
        <meta property="og:url" content="https://briefkasten.vercel.app" />
        <meta property="og:image" content={''} />
        <meta name="twitter:image" content={''} />
        <title>Briefkasten</title>
        {/* <script */}
        {/*   type="application/ld+json" */}
        {/*   dangerouslySetInnerHTML={{ */}
        {/*     __html: JSON.stringify({ */}
        {/*       '@context': 'http://schema.org/', */}
        {/*       '@type': 'Person', */}
        {/*       name: 'Nico Domino', */}
        {/*       image: 'https://ndo.dev/assets/img/avatar.png', */}
        {/*       url: 'https://ndo.dev', */}
        {/*       jobTitle: 'Fullstack Web Developer', */}
        {/*       worksFor: { */}
        {/*         '@type': 'Organization', */}
        {/*         name: 'Checkly', */}
        {/*       }, */}
        {/*       sameAs: [ */}
        {/*         'https://www.linkedin.com/in/ndom91/', */}
        {/*         'https://twitter.com/ndom91', */}
        {/*         'https://github.com/ndom91', */}
        {/*       ], */}
        {/*     }), */}
        {/*   }} */}
        {/* /> */}
      </Head>
      <Script
        src="/p.js"
        data-domain="briefkasten.vercel.app"
        data-api="/a/e"
      />
    </>
  )
}

export default Meta
