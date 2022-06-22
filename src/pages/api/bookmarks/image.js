import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

export default async function Imge(req, res) {
  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath:
        process.env.NODE_ENV !== 'development'
          ? await chromium.executablePath
          : '/Applications/Thorium.app/Contents/MacOS/Thorium',
      headless: true,
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })
    await page.goto(req.query.url, { waitUntil: 'networkidle0' })

    // Hack for accepting cookie banners
    const selectors = [
      '[id*=cookie] a',
      '[class*=consent] button',
      '[class*=cookie] a',
      '[id*=cookie] button',
      '[class*=cookie] button',
    ]

    const regex =
      /(Accept all|I agree|Accept|Agree|Agree all|Ich stimme zu|Okay|OK)/

    const elements = await page.$$(selectors)
    for (const el of elements) {
      const innerText = (await el.getProperty('innerText')).toString()
      regex.test(innerText, 'ig') && el.click()
    }

    // Wait for cookie banner to be gone
    await page.waitForNetworkIdle({
      timeout: 25000,
    })

    // Snap screenshot
    const buffer = await page.screenshot({ type: 'jpeg', quality: 50 })

    await page.close()
    await browser.close()

    // Set the `s-maxage` property to cache at the CDN layer
    res.setHeader('Cache-Control', 's-maxage=31536000, public')
    res.setHeader('Content-Type', 'image/jpeg')
    return res.end(buffer)
  } catch (e) {
    return res.json({
      message: 'Image Capture Failed',
      image: { error: e },
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
