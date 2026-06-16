import { randomUUID } from "node:crypto"
import WebSocket from "ws"
import { EDGE_AI_KEY } from "$env/static/private"

const EDGE_SPEECH_URL =
  "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1"
const EDGE_API_TOKEN = EDGE_AI_KEY

const configContent = JSON.stringify({
  context: {
    synthesis: {
      audio: {
        metadataoptions: { sentenceBoundaryEnabled: false, wordBoundaryEnabled: true },
        outputFormat: "audio-24khz-48kbitrate-mono-mp3",
      },
    },
  },
})

const genHeader = (connectId: string) => {
  const date = new Date().toString()
  const configHeader = {
    "Content-Type": "application/json; charset=utf-8",
    Path: "speech.config",
    "X-Timestamp": date,
  }
  const contentHeader = {
    "Content-Type": "application/ssml+xml",
    Path: "ssml",
    "X-RequestId": connectId,
    "X-Timestamp": date,
  }
  return {
    configHeader,
    contentHeader,
  }
}

export interface CreateEdgeSpeechCompletionOptions {
  payload: any
}

export const createEdgeSpeech = async ({
  payload,
}: CreateEdgeSpeechCompletionOptions): Promise<Response> => {
  const { input, options } = payload

  const connectId = randomUUID().replaceAll("-", "")

  const searchParams = new URLSearchParams({
    ConnectionId: connectId,
    TrustedClientToken: EDGE_API_TOKEN,
  })
  const url = EDGE_SPEECH_URL

  const { configHeader, contentHeader } = genHeader(connectId)
  const config = genSendContent(configHeader, configContent)
  const content = genSendContent(contentHeader, genSSML(input, options))

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`${url}?${searchParams.toString()}`)
    ws.binaryType = "arraybuffer"
    const onOpen = () => {
      ws.send(config)
      ws.send(content)
    }
    let audioData = new ArrayBuffer(0)
    const onMessage = async (event: WebSocket.MessageEvent) => {
      if (typeof event.data === "string") {
        const { headers } = getHeadersAndData(event.data)
        switch (headers.Path) {
          case "turn.end": {
            ws.close()
            if (!audioData.byteLength) {
              return
            }
            const res = new Response(audioData)
            resolve(res)
            break
          }
        }
      } else if (event.data instanceof ArrayBuffer) {
        const dataview = new DataView(event.data)
        const headerLength = dataview.getInt16(0)
        if (event.data.byteLength > headerLength + 2) {
          const newBody = event.data.slice(2 + headerLength)
          const newAudioData = new ArrayBuffer(audioData.byteLength + newBody.byteLength)
          const mergedUint8Array = new Uint8Array(newAudioData)
          mergedUint8Array.set(new Uint8Array(audioData), 0)
          mergedUint8Array.set(new Uint8Array(newBody), audioData.byteLength)
          audioData = newAudioData
        }
      }
    }
    const onError = () => {
      reject(new Error("WebSocket error occurred."))
      ws.close()
    }
    ws.addEventListener("open", onOpen)
    ws.addEventListener("message", onMessage)
    ws.addEventListener("error", onError)
  })
}

export const getHeadersAndData = (data: string) => {
  const headers: { [key: string]: string } = {}
  for (const line of data.slice(0, data.indexOf("\r\n\r\n")).split("\r\n")) {
    const [key, value] = line.split(":", 2)
    if (key) headers[key] = value ?? ""
  }
  return { data: data.slice(data.indexOf("\r\n\r\n") + 4), headers }
}
export const genSendContent = (header: { [key: string]: string }, data: string) => {
  const content = []
  for (const [key, value] of Object.entries(header)) {
    content.push(`${key}:${value}`)
  }
  content.push("", data)
  return content.join("\r\n")
}

export type StyleName =
  | "affectionate"
  | "angry"
  | "calm"
  | "cheerful"
  | "disgruntled"
  | "embarrassed"
  | "fearful"
  | "general"
  | "gentle"
  | "sad"
  | "serious"

export interface SsmlOptions {
  pitch?: number
  rate?: number
  style?: StyleName
  voice: string
}

const voiceTemplate = (input: string, { voice }: Pick<SsmlOptions, "voice">) =>
  `<voice name="${voice}">${input}</voice>`

const styleTemplate = (input: string, { style }: Pick<SsmlOptions, "style">) => {
  if (!style) {
    return input
  }
  return `<mstts:express-as style="${style}">${input}</mstts:express-as>`
}

const prosodyTemplate = (input: string, { pitch, rate }: Pick<SsmlOptions, "pitch" | "rate">) => {
  if (!pitch && !rate) {
    return input
  }
  return `<prosody pitch="${Math.floor((pitch || 1) * 100)}%" rate="${Math.floor(
    (rate || 1) * 100
  )}%">${input}</prosody>`
}
const speackTemplate = (input: string) =>
  `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">${input}</speak>`

export const genSSML = (input: string, options: SsmlOptions) => {
  let ssml = prosodyTemplate(input, options)
  ssml = styleTemplate(ssml, options)
  ssml = voiceTemplate(ssml, options)
  ssml = speackTemplate(ssml)

  return ssml
}
