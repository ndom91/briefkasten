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

  await page.waitForNetworkIdle()
  const buffer = await page.screenshot({ type: 'png' })
  // Set the `s-maxage` property to cache at the CDN layer
  res.setHeader('Cache-Control', 's-maxage=31536000, public')
  res.setHeader('Content-Type', 'image/png')
  return res.end(buffer)
}
