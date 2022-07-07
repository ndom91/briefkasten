const prepareBase64DataUrl = (base64) => base64.replace(/^.+,/, '')
// .replace('data:image/jpeg;', 'data:image/jpeg;charset=utf-8;')

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
    let buffer = Buffer.from(await blob.arrayBuffer())
    return `data:image/jpeg;bas64,${buffer.toString('base64')}`
  }
}

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export { prepareBase64DataUrl, asyncFileReader, range }
