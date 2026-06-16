import metascraper from "metascraper"
import metascraperAuthor from "metascraper-author"
import metascraperDate from "metascraper-date"
import metascraperDescription from "metascraper-description"
import metascraperFeed from "metascraper-feed"
import metascraperImage from "metascraper-image"
import metascraperLang from "metascraper-lang"
import metascraperReadability from "metascraper-readability"
import metascraperTitle from "metascraper-title"
import metascraperUrl from "metascraper-url"
import metascraperX from "metascraper-x"
import { getThumbhash } from "$lib/server/thumbhash"

const metascraperClient = metascraper([
  metascraperX(),
  metascraperDescription(),
  metascraperTitle(),
  metascraperImage(),
  metascraperLang(),
  metascraperAuthor(),
  metascraperFeed(),
  metascraperReadability(),
  metascraperDate(),
  metascraperUrl(),
])

export const fetchBookmarkMetadata = async (url: string) => {
  let b64Thumbhash = ""
  const targetPageResponse = await fetch(url)
  const bookmarkPageText = await targetPageResponse.text()
  const metadata = await metascraperClient({ html: bookmarkPageText, url })

  if (!metadata.image) {
    return {
      imageUrl: undefined,
      imageBlur: undefined,
      metadata,
    }
  }

  try {
    b64Thumbhash = await getThumbhash(metadata.image)
  } catch (error) {
    console.error("Failed to get thumbhash", String(error))
  }

  return {
    imageUrl: metadata.image,
    imageBlur: b64Thumbhash,
    metadata,
  }
}
