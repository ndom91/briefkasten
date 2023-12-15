export const parsePocketBookmarks = (doc, userId) => {
  const dataElements = doc.querySelectorAll("body ul > li")
  const bookmarks = Array.from(dataElements)
    .map((element) => {
      if (element.tagName === "LI" && element.firstElementChild.attributes.href) {
        const title = element.textContent?.replaceAll("\n", "").trim().substring(0, 190)
        const url = element.firstElementChild?.attributes?.href?.value?.trim()
        const date = element.firstElementChild?.attributes?.time_added?.value?.trim()
        // TODO: Parse tags out in 'api/bookmarks/bulk` and create those in Prisma
        // and then link them to the newly created bookmarks

        // const tags = element.firstElementChild?.attributes?.tags?.value
        //   .trim()
        //   .split(',')

        return {
          title,
          url,
          userId,
          createdAt: parseInt(date) ? new Date(parseInt(date) * 1000).toISOString() : 0,
          // tags,
        }
      }
    })
    .filter(Boolean)
  return bookmarks
}
