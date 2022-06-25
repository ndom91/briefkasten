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
  }
}

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export { prepareBase64DataUrl, asyncFileReader, range }
