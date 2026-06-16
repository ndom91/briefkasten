import sharp from "sharp"
import * as Thumbhash from "thumbhash"

const binaryToBase64 = (binary: Uint8Array) => btoa(String.fromCharCode(...binary))

export const getThumbhash = async (imgUrl: string) => {
  const imageResponse = await fetch(imgUrl)
  const imageBuffer = await imageResponse.arrayBuffer()
  const image = sharp(imageBuffer).resize(100, 100, { fit: "inside" })
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  const binaryThumbhash = Thumbhash.rgbaToThumbHash(info.width, info.height, data)
  return binaryToBase64(binaryThumbhash)
}
