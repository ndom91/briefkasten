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

export { getBase64StringFromDataURL, asyncFileReader }
