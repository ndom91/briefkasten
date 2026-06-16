import { parseFeed } from "@rowanmanning/feed-parser"
import type { Feed } from "@rowanmanning/feed-parser/lib/feed/base.js"
import debugFactory from "./log.js"

const debug = debugFactory("backend:fetch-feed")

interface FetchFeed {
  url: string
  lastFetched?: Date | null
}

export const fetchFeed = async ({
  url,
  lastFetched = null,
}: FetchFeed): Promise<Feed | undefined> => {
  const headers: Record<string, string> = {
    "User-Agent": "Briefkasten/1.0 (+https://github.com/ndom91/briefkastenhq)",
    "Accept-Encoding": "gzip",
  }

  if (lastFetched) {
    headers["If-Modified-Since"] = lastFetched?.toISOString()
  }

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(15000),
  })

  if (response.status === 304) {
    debug(`Feed not modified since last fetch - ${url}`)
    return
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch feed ${url}: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  return parseFeed(xml)
}
