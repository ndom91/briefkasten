import chromium from 'chrome-aws-lambda'
// import playwright from 'playwright-core'
import puppeteer from 'puppeteer-core'

export default async function Imge(req, res) {
  // Start Playwright with the dynamic chrome-aws-lambda args
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.NODE_ENV !== 'development'
        ? await chromium.executablePath
        : '/bin/chromium',
    headless: true,
  })

  // Create a page with the recommended Open Graph image size
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 720,
    },
  })

  // Extract the url from the query parameter `path`
  const url = decodeURIComponent(req.query.url)

  console.log('IMAGE URL', url)

  await page.goto(url)

  const buffer = await page.screenshot({
    type: 'png',
  })
  console.log('IMAGE DATA', buffer.length)

  await browser.close()
  await page.close()

  console.log('IMAGE FINISHED')

  // Set the `s-maxage` property to cache at the CDN layer
  res.setHeader('Cache-Control', 's-maxage=31536000, public')
  res.setHeader('Content-Type', 'image/png')
  return res.end(buffer)
}
