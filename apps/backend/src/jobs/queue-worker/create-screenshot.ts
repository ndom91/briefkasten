import type { Buffer } from "node:buffer"
import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { userInfo } from "node:os"
import { join } from "node:path"
import { chromium } from "playwright-chromium"
import { getThumbhash } from "../../lib/blurhash.js"
import debugFactory from "../../lib/log.js"
import { db } from "../../plugins/prisma.js"
import { uploadImage } from "../../plugins/storage.js"

const debug = debugFactory("backend:create-screenshot")

interface UpdateImageUrlArgs {
  image: Buffer
  imageUrl: string
  bookmarkId: string
}

interface ScreenshotArgs {
  url: string
}

export interface CreateScreenshot {
  url: string
  userId: string
}

export const createScreenshot = async (data: CreateScreenshot) => {
  if (
    !process.env.BUCKET_PUBLIC_URL ||
    !process.env.BUCKET_SECRET_KEY ||
    !process.env.BUCKET_ACCESS_KEY ||
    !process.env.BUCKET_URL
  ) {
    console.error("Cannot take screenshot, missing object store credentials")
    return
  }
  debug("Creating Screenshot For:", data)

  const { url, userId } = data

  // Visit URL and take screenshot with playwright-core
  const image = await screenshotUrl({ url })
  if (!image) {
    return
  }

  // Resolve the bookmark id so the object is keyed by it
  const bookmark = await db.bookmark.findUnique({
    where: { url_userId: { url, userId } },
    select: { id: true },
  })
  if (!bookmark) {
    debug("No bookmark found for screenshot", { url, userId })
    return
  }

  // Upload image to storage
  const publicImageUrl = await uploadImage({
    image,
    bookmarkId: bookmark.id,
    userId,
  })

  // Update bookmark.imageUrl database entry
  await updateImageUrl({ image, imageUrl: publicImageUrl, bookmarkId: bookmark.id })
}

const updateImageUrl = async ({ image, imageUrl, bookmarkId }: UpdateImageUrlArgs) => {
  // Generate thumbhash b64 string from image
  const imageBlur = await getThumbhash(image)

  await db.bookmark.update({
    data: {
      image: imageUrl,
      imageBlur,
    },
    where: {
      id: bookmarkId,
    },
  })
}

const screenshotUrl = async ({ url }: ScreenshotArgs) => {
  const localChromiumPath = await getLocalChromiumPath()
  const browser = await chromium.launch({
    executablePath:
      process.env.NODE_ENV !== "development" ? chromium.executablePath() : localChromiumPath,
    headless: true,
  })

  try {
    const page = await browser.newPage({
      locale: "en-US",
      viewport: { width: 960, height: 540 },
      deviceScaleFactor: 1,
      userAgent:
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    })
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 })

    // Finding and clicking away cookie banners
    const selectors = [
      "[id*=cookie] a",
      "[class*=consent] button",
      "[class*=cookie] a",
      "[id*=cookie] button",
      "[class*=cookie] button",
    ]
    const cookieSelectors = page.locator(selectors.join(", "))

    const btnRegex = new RegExp(
      /(Accept all|Accept all cookies|I agree|Accept|Agree|Agree all|Ich stimme zu|Okay|OK)/,
      "gi"
    )
    const cookieBtnLocator = page.getByRole("button", { name: btnRegex })

    await cookieBtnLocator
      .first()
      .click({ timeout: 1000 })
      .catch(() => undefined)
    await page.addLocatorHandler(cookieSelectors, async (locator) => {
      await locator
        .first()
        .click({ timeout: 1000 })
        .catch(() => undefined)
    })

    // Screenshot
    if (url.includes("x.com") || url.includes("twitter.com")) {
      await page
        .getByTestId("xMigrationBottomBar")
        .click({ timeout: 1000 })
        .catch(() => undefined)
      await page.waitForTimeout(2500)

      const tweetElement = page.getByTestId("tweet")
      if ((await tweetElement.count()) > 0) {
        return await tweetElement.first().screenshot({ type: "png", scale: "css" })
      }
    }

    // Cookie-banner clicks above auto-scroll their target into view; reset to
    // the top so the screenshot captures the page header, not a footer element.
    await page.evaluate(() => window.scrollTo(0, 0))

    return await page.screenshot({ type: "png", scale: "css" })
  } finally {
    await browser.close()
  }
}

// Workaround for NixOS Local Chromium Path
const getLocalChromiumPath = async () => {
  const osRelease = await readFile("/etc/os-release").catch(() => null)
  if (!osRelease) {
    return chromium.executablePath()
  }

  const isNix = osRelease.includes("ID=nixos")
  if (isNix) {
    const user = userInfo()

    const chromiumBinPath = join(user.homedir, ".nix-profile", "bin", "chromium")
    if (existsSync(chromiumBinPath)) {
      return chromiumBinPath
    }
  }
  return "/bin/chromium"
}
