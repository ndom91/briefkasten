const getBase64StringFromDataURL = (dataURL) =>
  dataURL.replace('data:', '').replace(/^.+,/, '')

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
    return 'data:' + blob.type + ';base64,' + buffer.toString('base64')
  }
}

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export { getBase64StringFromDataURL, asyncFileReader, range }
