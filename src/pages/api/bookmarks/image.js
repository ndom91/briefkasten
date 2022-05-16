import chromium from 'chrome-aws-lambda'
import playwright from 'playwright-core'

export default async function Imge(req, res) {
  // Start Playwright with the dynamic chrome-aws-lambda args
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath:
      process.env.NODE_ENV !== 'development'
        ? await chromium.executablePath
        : '/usr/bin/chromium',
    headless: process.env.NODE_ENV !== 'development' ? chromium.headless : true,
  })

  // Create a page with the recommended Open Graph image size
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 720,
    },
  })

  // Extract the url from the query parameter `path`
  const url = req.query.url

  // Pass current color-scheme to headless chrome
  const colorScheme = req.query.colorScheme

  await page.emulateMedia({ colorScheme })

  await page.goto(url)

  const data = await page.screenshot({
    type: 'png',
  })

  await browser.close()

  // Set the `s-maxage` property to cache at the CDN layer
  res.setHeader('Cache-Control', 's-maxage=31536000, public')
  res.setHeader('Content-Type', 'image/png')
  res.end(data)
}
