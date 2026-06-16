type Bookmark = LoadBookmarkFlatTags

export class BookmarksService {
  bookmarks = $state<Bookmark[]>([])

  constructor(initial?: Bookmark[]) {
    if (initial) {
      this.bookmarks.push(...initial)
    }
  }

  add(bookmark: Bookmark | Bookmark[]) {
    if (Array.isArray(bookmark)) {
      bookmark.forEach((bk) => {
        if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bk.id)) return
        this.bookmarks.unshift(bk)
      })
    } else {
      if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bookmark.id)) return
      this.bookmarks.unshift(bookmark)
    }
  }

  append(bookmark: Bookmark | Bookmark[]) {
    if (Array.isArray(bookmark)) {
      bookmark.forEach((bk) => {
        if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bk.id)) return
        this.bookmarks.push(bk)
      })
    } else {
      if (this.bookmarks.find((savedBookmark) => savedBookmark.id === bookmark.id)) return
      this.bookmarks.push(bookmark)
    }
  }

  clear() {
    this.bookmarks.splice(0)
  }

  replace(bookmarks: Bookmark[]) {
    this.bookmarks.splice(0, this.bookmarks.length, ...bookmarks)
  }

  mergePage(bookmarks: Bookmark[]) {
    const bookmarkIds = new Set(bookmarks.map((bookmark) => bookmark.id))
    const preservedTail = this.bookmarks.filter((bookmark) => !bookmarkIds.has(bookmark.id))
    this.bookmarks.splice(0, this.bookmarks.length, ...bookmarks, ...preservedTail)
  }

  remove(bookmarkId: string) {
    const bookmarkIndex = this.bookmarks.findIndex((bk) => bk.id === bookmarkId)
    if (bookmarkIndex === -1) return
    this.bookmarks.splice(bookmarkIndex, 1)
  }

  update(bookmark: Bookmark) {
    const bookmarkIndex = this.bookmarks.findIndex((bk) => bk.id === bookmark.id)
    if (bookmarkIndex !== -1) {
      this.bookmarks[bookmarkIndex] = bookmark
    }
  }

  upsert(bookmark: Bookmark) {
    const bookmarkIndex = this.bookmarks.findIndex((bk) => bk.id === bookmark.id)
    if (bookmarkIndex !== -1) {
      this.bookmarks[bookmarkIndex] = bookmark
    } else {
      this.bookmarks.push(bookmark)
    }
  }

  find(bookmarkId: string) {
    return this.bookmarks.find((bk) => bk.id === bookmarkId)
  }
}
