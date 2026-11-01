import assert from "node:assert/strict"
import { afterEach, mock, test } from "node:test"
import { chromium } from "playwright-chromium"

process.env.BUCKET_ACCESS_KEY = "test"
process.env.BUCKET_SECRET_KEY = "test"
process.env.BUCKET_URL = "http://localhost:9000"

const { screenshotUrl } = await import("../src/jobs/queue-worker/create-screenshot.ts")

afterEach(() => mock.restoreAll())

const setupBrowser = ({ navigationError, closeError } = {}) => {
  const image = Buffer.from("screenshot")
  const click = async () => {}
  const page = {
    goto: async () => {
      if (navigationError) throw navigationError
    },
    locator: () => ({}),
    getByRole: () => ({ first: () => ({ click }) }),
    addLocatorHandler: async () => {},
    evaluate: async () => {},
    screenshot: async () => image,
  }
  const close = mock.fn(async () => {
    if (closeError) throw closeError
  })
  mock.method(chromium, "launch", async () => ({ newPage: async () => page, close }))
  return { image, close }
}

test("closes the browser after a successful screenshot", async () => {
  const { image, close } = setupBrowser()
  assert.deepEqual(await screenshotUrl({ url: "https://example.com" }), image)
  assert.equal(close.mock.callCount(), 1)
})

test("closes the browser when navigation fails", async () => {
  const error = new Error("navigation failed")
  const { close } = setupBrowser({ navigationError: error })
  await assert.rejects(screenshotUrl({ url: "https://example.com" }), (err) => err === error)
  assert.equal(close.mock.callCount(), 1)
})

test("closes the browser when creating a page fails", async () => {
  const error = new Error("page creation failed")
  const close = mock.fn(async () => {})
  mock.method(chromium, "launch", async () => ({
    newPage: async () => {
      throw error
    },
    close,
  }))
  await assert.rejects(screenshotUrl({ url: "https://example.com" }), (err) => err === error)
  assert.equal(close.mock.callCount(), 1)
})

test("reports cleanup failures without hiding the original screenshot error", async () => {
  const navigationError = new Error("navigation failed")
  const closeError = new Error("close failed")
  const { close } = setupBrowser({ navigationError, closeError })
  const log = mock.method(console, "error", () => {})
  await assert.rejects(
    screenshotUrl({ url: "https://example.com" }),
    (err) => err === navigationError
  )
  assert.equal(close.mock.callCount(), 1)
  assert.equal(log.mock.calls[0].arguments[1], closeError)
})

test("propagates cleanup failures after a successful screenshot", async () => {
  const closeError = new Error("close failed")
  const { close } = setupBrowser({ closeError })
  await assert.rejects(screenshotUrl({ url: "https://example.com" }), (err) => err === closeError)
  assert.equal(close.mock.callCount(), 1)
})
