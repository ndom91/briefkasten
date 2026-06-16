export const parseChromeBookmarks = (doc: Document) => {
  const dataElements = doc.querySelectorAll("dl dt")
  if (!dataElements) {
    return []
  }

  return Array.from(dataElements)
    .map((element) => {
      // @ts-expect-error No DOM interface for DT, MDN says its a `HTMLElement`s
      if (element.tagName === "DT" && element.firstElementChild?.attributes.href) {
        const title = element.textContent?.replaceAll("\n", "").trim().substring(0, 190)
        // @ts-expect-error No DOM interface for DT, MDN says its a `HTMLElement`s
        const url = element.firstElementChild?.attributes?.href?.value?.trim()
        // @ts-expect-error No DOM interface for DT, MDN say its a `HTMLElement`s
        const date = element.firstElementChild?.attributes?.add_date?.value?.trim()

        return {
          title,
          url,
          createdAt: Number.parseInt(date)
            ? new Date(Number.parseInt(date) * 1000).toISOString()
            : 0,
        }
      }
    })
    .filter(Boolean)
}
