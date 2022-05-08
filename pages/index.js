import Head from 'next/head';
import BookmarkCard from '../components/BookmarkCard';
import prisma from '../lib/prisma';

export default function Home({ bookmarks }) {
  return (
    <div>
      <Head>
        <title>Briefkasten</title>
        <meta name="description" content="PlanetScale Quickstart for Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 mx-auto max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 text-center">Bookmark Manager</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center  gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard bookmark={bookmark} key={bookmark.id} />
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps(_context) {
  const bookmarks = await prisma.bookmark.findMany({
    include: {
      category: true,
    },
  });

  return {
    props: { bookmarks },
  };
}
