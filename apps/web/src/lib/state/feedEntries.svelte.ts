type FeedEntry = LoadFeedEntry

export class FeedEntriesService {
  feedEntries = $state<FeedEntry[]>([])

  constructor(initial?: FeedEntry[]) {
    if (initial) {
      this.feedEntries.push(...initial)
    }
  }

  add(feedEntries: FeedEntry | FeedEntry[]) {
    if (Array.isArray(feedEntries)) {
      feedEntries.forEach((feedEntry) => {
        if (this.feedEntries.find((savedFeedEntry) => savedFeedEntry.id === feedEntry.id)) return
        this.feedEntries.push(feedEntry)
      })
    } else {
      if (this.feedEntries.find((savedFeedEntry) => savedFeedEntry.id === feedEntries.id)) return
      this.feedEntries.push(feedEntries)
    }
  }

  clear() {
    this.feedEntries.splice(0)
  }

  replace(feedEntries: FeedEntry[]) {
    this.feedEntries.splice(0, this.feedEntries.length, ...feedEntries)
  }

  mergePage(feedEntries: FeedEntry[]) {
    const feedEntryIds = new Set(feedEntries.map((feedEntry) => feedEntry.id))
    const preservedTail = this.feedEntries.filter((feedEntry) => !feedEntryIds.has(feedEntry.id))
    this.feedEntries.splice(0, this.feedEntries.length, ...feedEntries, ...preservedTail)
  }

  remove(feedEntryId: string) {
    const feedEntryIndex = this.feedEntries.findIndex((feedEntry) => feedEntry.id === feedEntryId)
    if (feedEntryIndex === -1) return
    this.feedEntries.splice(feedEntryIndex, 1)
  }

  update(feedEntry: FeedEntry) {
    const feedEntryIndex = this.feedEntries.findIndex(
      (saveFeedEntry) => saveFeedEntry.id === feedEntry.id
    )
    if (feedEntryIndex !== -1) {
      this.feedEntries[feedEntryIndex] = feedEntry
    }
  }

  find(feedEntryId: string) {
    return this.feedEntries.find((feedEntry) => feedEntry.id === feedEntryId)
  }
}
