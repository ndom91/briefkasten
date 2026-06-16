import type { SvelteMap } from "svelte"
import type { Prisma } from "../prisma-client/client.js"

declare global {
  // biome-ignore lint: no-explicit-any
  type TODO = any

  type bk = Prisma.BookmarkGetPayload<object>

  export const bookmarksWithRelationships = Prisma.validator<Prisma.BookmarkDefaultArgs>()({
    include: { tags: { include: { tag: true } }, category: true },
  })
  type LoadBookmark = Prisma.BookmarkGetPayload<typeof bookmarksWithRelationships>
  type FlatTags = Prisma.TagGetPayload<object>
  type LoadBookmarkFlatTags = Omit<LoadBookmark, "tags"> & {
    tags: FlatTags[]
  } & { metadata: Record<string, string> }

  type LoadFeedEntry = Prisma.FeedEntryGetPayload<{
    include: { feed: true; feedMedia: true }
  }>
  type LoadFeed = Prisma.FeedGetPayload<object> & { visible: boolean }

  interface BookmarkContext {
    bookmarks: SvelteMap<string, LoadBookmarkFlatTags>
    add: (bookmark: LoadBookmarkFlatTags | LoadBookmarkFlatTags[]) => void
    remove: (bookmarkId: string) => void
    update: (bookmark: LoadBookmarkFlatTags) => void
    find: (bookmarkId: string) => LoadBookmarkFlatTags | undefined
  }

  declare const __DATE__: string
  interface ViewTransition {
    updateCallbackDone: Promise<void>
    ready: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }

  interface Document {
    startViewTransition: (updateCallback: () => Promise<void>) => ViewTransition
  }
}
