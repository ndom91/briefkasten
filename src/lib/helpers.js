export const prepareBase64DataUrl = (base64) => base64.replace(/^.+,/, '')

export const asyncFileReader = async (blob) => {
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

export const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export const setTiming = (name, obj) => {
  const now = performance.now()
  if (obj[name]?.start) {
    obj[name].end = now
    obj[name].dur = now - obj[name].start
  } else {
    obj[name] = { start: now }
  }
}

export const isAbsoluteUrl = (url) => /^[a-z][a-z0-9+.-]*:/.test(url)
