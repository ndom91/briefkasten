import type { Feed } from "@rowanmanning/feed-parser/lib/feed/base.js"

interface FeedEntryDataArgs {
  ingestedAt?: Date
  item: Feed["items"][number]
  userId: string
}

const getCategories = (item: Feed["items"][number]) => {
  return (item.categories ?? [])
    .map((category) => category.label)
    .filter((label) => !label?.includes("|"))
    .filter(Boolean) as string[]
}

const getFeedMedia = (item: Feed["items"][number], userId: string) => {
  return (
    item.media
      ?.filter((media) => media.type === "image" && !!media.title && !!media.url)
      .map((media) => ({
        href: media.url,
        title: media.title,
        user: {
          connect: {
            id: userId,
          },
        },
      })) ?? []
  )
}

export const createFeedEntryBaseData = ({
  ingestedAt = new Date(),
  item,
  userId,
}: FeedEntryDataArgs) => ({
  title: item.title ?? "",
  guid: item.id,
  link: item.url ?? "",
  author: item.authors?.[0]?.name,
  content: item.content ?? item.description,
  contentSnippet: item.description,
  ingested: ingestedAt.toISOString(),
  published: item.published,
  categories: getCategories(item),
  user: {
    connect: {
      id: userId,
    },
  },
  feedMedia: {
    create: getFeedMedia(item, userId),
  },
})
