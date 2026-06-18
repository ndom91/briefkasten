import { LRUCache } from "lru-cache"
import { db } from "../plugins/prisma.js"
import { screenshotQueue } from "../plugins/queue.js"
import { actions } from "./constants.js"
import debugFactory from "./log.js"

const debug = debugFactory("backend:bookmark-image-repair")

const MAX_SCREENSHOT_QUEUE_LENGTH = 100
const MAX_PROXY_MATCHES = 20
const STALE_IMAGE_PATTERNS = ["supabase.co", "picsum.photos", "picsum.photo"]

const repairCache = new LRUCache<string, true>({
  max: 2000,
  ttl: 30 * 60 * 1000,
})

export const bookmarkIdPattern = /^[a-z0-9]{16,40}$/

interface BookmarkRepairTarget {
  id: string
  url: string
  userId: string
}

const canQueueScreenshotRepair = () => screenshotQueue.length() <= MAX_SCREENSHOT_QUEUE_LENGTH

export const getSourceImageUrlsFromProxyTarget = (targetUrl: string) => {
  const match = targetUrl.match(/\/(?:_|[^/]+)\/(https?:\/\/.+)$/)
  const rawImageUrl = match?.[1]
  if (!rawImageUrl || rawImageUrl.length > 4096) {
    return []
  }

  const imageUrls = [rawImageUrl]
  try {
    const decodedImageUrl = decodeURIComponent(rawImageUrl)
    if (decodedImageUrl !== rawImageUrl) {
      imageUrls.push(decodedImageUrl)
    }
  } catch {
    // Keep the raw URL for exact DB lookup when malformed percent-encoding is present.
  }

  return imageUrls
}

export const hasStaleSavedImageUrl = (imageUrls: string[]) => {
  return imageUrls.some((imageUrl) =>
    STALE_IMAGE_PATTERNS.some((pattern) => imageUrl.includes(pattern))
  )
}

const queueBookmarkScreenshotRepair = (bookmark: BookmarkRepairTarget, reason: string) => {
  if (repairCache.has(bookmark.id)) {
    return false
  }

  repairCache.set(bookmark.id, true)

  if (!canQueueScreenshotRepair()) {
    debug("Skipping screenshot repair because the queue is backed up", {
      queueLength: screenshotQueue.length(),
    })
    return false
  }

  debug("Queueing bookmark screenshot repair", {
    bookmarkId: bookmark.id,
    reason,
  })

  void screenshotQueue
    .push({
      action: actions.ADD_SCREENSHOT,
      data: {
        url: bookmark.url,
        userId: bookmark.userId,
      },
    })
    .catch((error) => console.error(error))

  return true
}

export const enqueueScreenshotRepairsForImageUrls = async (imageUrls: string[], reason: string) => {
  if (!imageUrls.length || imageUrls.some((imageUrl) => repairCache.has(imageUrl))) {
    return 0
  }

  for (const imageUrl of imageUrls) {
    repairCache.set(imageUrl, true)
  }

  const bookmarks = await db.bookmark.findMany({
    where: {
      // Only repair when the saved image is itself stale (supabase/picsum). A
      // healthy stored screenshot that merely failed to proxy transiently must
      // not be regenerated, mirroring enqueueScreenshotRepairForBookmarkId.
      AND: [
        { OR: imageUrls.map((imageUrl) => ({ image: imageUrl })) },
        { OR: STALE_IMAGE_PATTERNS.map((pattern) => ({ image: { contains: pattern } })) },
      ],
    },
    select: {
      id: true,
      url: true,
      userId: true,
    },
    take: MAX_PROXY_MATCHES,
  })

  if (!bookmarks.length) {
    debug("No bookmark found for failed proxied image", { imageUrl: imageUrls[0] })
    return 0
  }

  return bookmarks.filter((bookmark) => queueBookmarkScreenshotRepair(bookmark, reason)).length
}

export const enqueueScreenshotRepairForBookmarkId = async (
  bookmarkId: string,
  reason: string,
  { force = false }: { force?: boolean } = {}
) => {
  if (!bookmarkIdPattern.test(bookmarkId) || repairCache.has(bookmarkId)) {
    return false
  }

  const bookmark = await db.bookmark.findFirst({
    where: {
      id: bookmarkId,
      // Force skips the "image missing/stale" filter: the caller already knows
      // the stored image is gone (permanent client error fetching it), so repair
      // regardless of the current image value.
      ...(force
        ? {}
        : {
            OR: [
              { image: null },
              { image: "" },
              ...STALE_IMAGE_PATTERNS.map((pattern) => ({
                image: {
                  contains: pattern,
                },
              })),
            ],
          }),
    },
    select: {
      id: true,
      url: true,
      userId: true,
    },
  })

  if (!bookmark) {
    repairCache.set(bookmarkId, true)
    return false
  }

  return queueBookmarkScreenshotRepair(bookmark, reason)
}
