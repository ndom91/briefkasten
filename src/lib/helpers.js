const getBase64StringFromDataURL = (dataURL) =>
  dataURL.replace('data:', '').replace(/^.+,/, '')

const asyncFileReader = async (blob) => {
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
}

const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export { getBase64StringFromDataURL, asyncFileReader, range }
