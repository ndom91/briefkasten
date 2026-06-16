// Adapted from https://www.npmjs.com/package/audiobuffer-to-wav

export function encodeWAV(samples) {
  const pcm = true
  const offset = 44

  var format = pcm ? 1 : 3
  var numChannels = 1
  var sampleRate = 16000
  var bitDepth = format === 3 ? 32 : 16

  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  const buffer = new ArrayBuffer(offset + samples.length * bytesPerSample)
  const view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, "RIFF")
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, "WAVE")
  /* format chunk identifier */
  writeString(view, 12, "fmt ")
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, "data")
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) {
    // Raw PCM
    floatTo16BitPCM(view, 44, samples)
  } else {
    writeFloat32(view, 44, samples)
  }

  return buffer
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; ++i) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

function floatTo16BitPCM(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
    var s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
}

function writeFloat32(output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true)
  }
}
