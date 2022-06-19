import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'
import { getSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'

export default async function Image(req, res) {
  try {
    const { url } = req.query
    const session = await getSession({ req })
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
    await page.goto(url, { waitUntil: 'networkidle0' })

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

    console.log('buffer', typeof buffer)
    let { data, error } = await supabase.storage.from('bookmark-imgs').upload(
      `${session.user?.userId}/${new URL(url).hostname}.jpg`,
      new Buffer.from(buffer, 'base64'),
      // buffer,
      {
        upsert: true,
        contentType: 'image/jpeg',
      }
    )
    console.log('supabase.data', data)
    console.log('supabase.error', error)

    if (error) {
      throw error
    }

    await page.close()
    await browser.close()

    // Set the `s-maxage` property to cache at the CDN layer
    // res.setHeader('Cache-Control', 's-maxage=31536000, public')
    // res.setHeader('Content-Type', 'image/jpeg')
    return res.json({
      message: `Uploaded Image for ${url}`,
      image: {
        url: `https://exjtybpqdtxkznbmllfi.supabase.co/storage/v1/object/public/${data?.Key}`,
      },
    })
  } catch (e) {
    console.error('[ERRRR]', e)
    return res.json({
      message: 'Upload Failed',
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
