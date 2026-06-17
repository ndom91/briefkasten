import metascraper from "metascraper"
import metascraperAuthor from "metascraper-author"
import metascraperDate from "metascraper-date"
import metascraperDescription from "metascraper-description"
import metascraperFeed from "metascraper-feed"
import metascraperLang from "metascraper-lang"
import metascraperReadability from "metascraper-readability"
import metascraperTitle from "metascraper-title"
import metascraperUrl from "metascraper-url"
import metascraperX from "metascraper-x"

const metascraperClient = metascraper([
  metascraperX(),
  metascraperDescription(),
  metascraperTitle(),
  metascraperLang(),
  metascraperAuthor(),
  metascraperFeed(),
  metascraperReadability(),
  metascraperDate(),
  metascraperUrl(),
])

export const fetchBookmarkMetadata = async (url: string) => {
  const targetPageResponse = await fetch(url)
  const bookmarkPageText = await targetPageResponse.text()
  const metadata = await metascraperClient({ html: bookmarkPageText, url })

  return { metadata }
}
