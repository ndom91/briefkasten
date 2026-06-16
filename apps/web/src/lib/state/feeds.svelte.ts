type Feed = LoadFeed

export class FeedsService {
  feeds = $state<Feed[]>([])

  constructor(initial?: Feed[]) {
    if (initial) {
      this.feeds.push(...initial)
    }
  }

  add(feeds: Feed | Feed[]) {
    if (Array.isArray(feeds)) {
      feeds.forEach((feed) => {
        if (this.feeds.find((savedFeed) => savedFeed.id === feed.id)) return
        this.feeds.unshift(feed)
      })
    } else {
      if (this.feeds.find((savedFeed) => savedFeed.id === feeds.id)) return
      this.feeds.unshift(feeds)
    }
  }

  append(feeds: Feed | Feed[]) {
    if (Array.isArray(feeds)) {
      feeds.forEach((feed) => {
        if (this.feeds.find((savedFeed) => savedFeed.id === feed.id)) return
        this.feeds.push(feed)
      })
    } else {
      if (this.feeds.find((savedFeed) => savedFeed.id === feeds.id)) return
      this.feeds.push(feeds)
    }
  }

  replace(feeds: Feed[]) {
    this.feeds.splice(0, this.feeds.length, ...feeds)
  }

  remove(feedId: string) {
    const feedIndex = this.feeds.findIndex((feed) => feed.id === feedId)
    if (feedIndex === -1) return
    this.feeds.splice(feedIndex, 1)
  }

  update(feed: Feed) {
    const feedIndex = this.feeds.findIndex((savedFeed) => savedFeed.id === feed.id)
    if (feedIndex !== -1) {
      this.feeds[feedIndex] = feed
    }
  }

  find(feedId: string) {
    return this.feeds.find((feed) => feed.id === feedId)
  }
}
