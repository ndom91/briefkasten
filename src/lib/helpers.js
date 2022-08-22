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
    return `data:image/png;bas64,${buffer.toString('base64')}`
  }
}

export const perf = () => {
  return performance ? performance : { now: () => new Date().getTime() }
}

export const range = (start, end) => {
  let length = end - start + 1
  return Array.from({ length }, (_, i) => i + start)
}

export const serverTiming = {
  timings: {},
  start: () => {
    serverTiming.timings = {
      total: {
        start: perf().now(),
      },
    }
  },
  measure: (name, desc) => {
    const now = perf().now()
    if (serverTiming.timings[name]?.start) {
      serverTiming.timings[name].end = now
      serverTiming.timings[name].dur = now - serverTiming.timings[name].start
      if (desc) serverTiming.timings[name].desc = desc
    } else {
      serverTiming.timings[name] = { start: now }
      if (desc) serverTiming.timings[name].desc = desc
    }
  },
  setHeader: () => {
    serverTiming.measure('total')
    return Object.entries(serverTiming.timings)
      .map(([name, measurements]) => {
        return `${name};${
          measurements.desc ? `desc="${measurements.desc}";` : ''
        }dur=${measurements.dur}`
      })
      .join(',')
  },
}

export const isAbsoluteUrl = (url) => /^[a-z][a-z0-9+.-]*:/.test(url)
