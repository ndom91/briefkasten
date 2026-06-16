import type { Context } from "hono"
import { createIPX, createIPXWebServer, ipxFSStorage, ipxHttpStorage } from "ipx"
import { LRUCache } from "lru-cache"
import {
  enqueueScreenshotRepairForBookmarkId,
  enqueueScreenshotRepairsForImageUrls,
  getSourceImageUrlsFromProxyTarget,
  hasStaleSavedImageUrl,
} from "./bookmark-image-repair.js"

const ipx = createIPX({
  storage: ipxFSStorage(),
  httpStorage: ipxHttpStorage({
    allowAllDomains: true,
    ignoreCacheControl: true,
  }),
})

const cache = new LRUCache<string, Blob>({
  max: 500,
})

const shouldRepairImage = (status: number) => status === 404 || status >= 500

const getProxyModifier = (targetUrl: string) => {
  return targetUrl.match(/\/([^/]+)\/https?:\/\/.+$/)?.[1]
}

const isSavedImageRequest = (targetUrl: string) => getProxyModifier(targetUrl) !== "_"

const getProxyRequest = (requestUrl: string) => {
  const url = new URL(requestUrl, "http://localhost")
  const repairBookmarkId = url.searchParams.get("bookmarkId")
  url.searchParams.delete("bookmarkId")

  return {
    repairBookmarkId,
    targetUrl: url.toString().replace(/\/img/, ""),
  }
}

const queueImageRepair = (imageUrls: string[], reason: string) => {
  void enqueueScreenshotRepairsForImageUrls(imageUrls, reason).catch((error) => {
    console.error(error)
  })
}

export const imageProxyHandler = async (c: Context) => {
  const { repairBookmarkId, targetUrl } = getProxyRequest(c.req.raw.url)
  const sourceImageUrls = getSourceImageUrlsFromProxyTarget(targetUrl)
  const shouldRepairRequest = isSavedImageRequest(targetUrl)

  if (repairBookmarkId) {
    void enqueueScreenshotRepairForBookmarkId(repairBookmarkId, "fallback-image-request").catch(
      (error) => console.error(error)
    )
  }

  if (shouldRepairRequest && hasStaleSavedImageUrl(sourceImageUrls)) {
    queueImageRepair(sourceImageUrls, "stale-saved-image-url")
  }

  const cachedResponse = cache.get(targetUrl)

  if (cachedResponse) {
    return new Response(cachedResponse, {
      status: 200,
      headers: {
        "x-cache": "HIT",
        "x-image-proxy": "0.0.1",
        "Content-Type": cachedResponse.type,
        "cache-control": "max-age=31536000, public, s-maxage=31536000",
      },
    })
  }

  let response: Response
  try {
    response = await createIPXWebServer(ipx)(new Request(targetUrl))
  } catch (error) {
    if (shouldRepairRequest) {
      queueImageRepair(sourceImageUrls, "failed-proxied-image")
    }
    console.error(error)
    return new Response("Image proxy failed", {
      status: 502,
      headers: {
        "x-cache": "MISS",
        "x-image-proxy": "0.0.1",
        "cache-control": "no-store",
      },
    })
  }

  if (shouldRepairRequest && shouldRepairImage(response.status)) {
    queueImageRepair(sourceImageUrls, "failed-proxied-image")
  }

  const clonedResponse = response.clone()
  let responseBody = response.body
  let responseStatus = response.status

  let data = await clonedResponse.blob()

  // Attempt retry if IPX doesn't handle image request properly
  if (!response.ok) {
    const extractedFaviconUrl = targetUrl.match(/\/_\/(https:\/\/.*)/)
    if (extractedFaviconUrl?.[1]) {
      const rawFaviconResponse = await fetch(extractedFaviconUrl[1], {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        },
      })
      const clonedRawFaviconResponse = rawFaviconResponse.clone()

      responseBody = rawFaviconResponse.body
      responseStatus = rawFaviconResponse.status

      data = await clonedRawFaviconResponse.blob()
    }
  }

  if (data.type.match(/^image/)) {
    cache.set(targetUrl, data)
  }

  if (shouldRepairRequest && shouldRepairImage(responseStatus)) {
    queueImageRepair(sourceImageUrls, "failed-proxied-image")
  }

  // TODO: Clone response body from raw retry to immediately return that
  return new Response(responseBody, {
    status: responseStatus,
    headers: {
      "x-cache": "MISS",
      "x-image-proxy": "0.0.1",
      "Content-Type": data.type,
      "cache-control": "max-age=31536000, public, s-maxage=31536000",
    },
  })
}
