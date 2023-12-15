export const parseChromeBookmarks = (doc, userId) => {
  const dataElements = doc.querySelectorAll("dl dt")
  const bookmarks = Array.from(dataElements)
    .map((element) => {
      if (element.tagName === "DT" && element.firstElementChild.attributes.href) {
        const title = element.textContent?.replaceAll("\n", "").trim().substring(0, 190)
        const url = element.firstElementChild?.attributes?.href?.value?.trim()
        const date = element.firstElementChild?.attributes?.add_date?.value?.trim()

        return {
          title,
          url,
          createdAt: parseInt(date) ? new Date(parseInt(date) * 1000).toISOString() : 0,
          userId,
        }
      }
    })
    .filter(Boolean)
  return bookmarks
}
