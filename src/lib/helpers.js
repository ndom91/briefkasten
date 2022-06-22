import { Blob } from 'buffer'

const prepareBase64DataUrl = (base64) =>
  base64
    .replace('data:image/jpeg;', 'data:image/jpeg;charset=utf-8;')
    .replace(/^.+,/, '')

const asyncFileReader = async (blob) => {
  if (typeof window !== 'undefined') {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()
        reader.onload = function () {
          resolve(this.result)
        }
        reader.readAsDataURL(blob)
      } catch (e) {
        reject(e)
      }
    })
  } else {
    let buffer = Buffer.from(await blob.text())
    return buffer.toString('base64')
    // return 'data:' + blob.type + ';base64,' + buffer.toString('base64')
  }
}

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

const base64ToArrayBuffer = (base64) => {
  // const binary_string = atob(base64)
  const binary_string = Buffer.from(base64, 'base64').toString()
  const len = binary_string.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i)
  }
  return bytes.buffer
}

const base64ToBlob = (b64Data, contentType = '', sliceSize = 512) => {
  console.log('b64toBlob', b64Data.substring(0, 30))
  const byteCharacters = Buffer.from(b64Data, 'base64').toString()
  // const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export {
  prepareBase64DataUrl,
  base64ToArrayBuffer,
  base64ToBlob,
  asyncFileReader,
  range,
}
