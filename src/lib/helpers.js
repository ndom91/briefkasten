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
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start)
}

export { getBase64StringFromDataURL, asyncFileReader, range }
