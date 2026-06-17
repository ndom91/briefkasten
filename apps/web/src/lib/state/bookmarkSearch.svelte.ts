import Fuse, { type IFuseOptions } from "fuse.js"

type Bookmark = LoadBookmarkFlatTags

const fuseOptions: IFuseOptions<Bookmark> = {
  useTokenSearch: true,
  tokenMatch: "all",
  includeScore: true,
  keys: [
    { name: "title", weight: 2 },
    { name: "url" },
    { name: "desc" },
    { name: "category.name" },
    { name: "tags.name" },
  ],
}

export class BookmarkSearchService {
  ready = $state(false)
  private fuse: Fuse<Bookmark> | undefined

  async load() {
    const response = await fetch("/api/v1/bookmarks/index")
    if (!response.ok) {
      throw new Error(`Failed to load bookmark search index: ${response.status}`)
    }
    const { data } = (await response.json()) as { data: Bookmark[] }
    this.fuse = new Fuse(data, fuseOptions)
    this.ready = true
  }

  search(query: string, limit = 50): Bookmark[] {
    const trimmed = query.trim()
    if (!trimmed || !this.fuse) {
      return []
    }
    return this.fuse.search(trimmed, { limit }).map((result) => result.item)
  }

  add(bookmark: Bookmark) {
    this.fuse?.add(bookmark)
  }

  remove(bookmarkId: string) {
    this.fuse?.remove((doc) => (doc as Bookmark).id === bookmarkId)
  }
}
