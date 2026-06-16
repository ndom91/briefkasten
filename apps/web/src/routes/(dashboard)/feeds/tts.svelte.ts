import { TTSLocation, useInterface } from "$lib/state/ui.svelte"
import ttsWorkerUrl from "$lib/transformers/tts-worker?url"

const ui = useInterface()
let progressItems = $state<TODO>([])
let ttsWorker = $state<Worker>()

export const registerTtsWorker = () => {
  $effect(() => {
    if (
      !ui.aiFeaturesPreferences.tts.enabled ||
      ui.aiFeaturesPreferences.tts.location !== TTSLocation.Browser
    ) {
      return
    }
    if (!ttsWorker) {
      ttsWorker = new Worker(new URL(ttsWorkerUrl, import.meta.url), {
        type: "module",
      })
    }

    const onMessageReceived = (e: TODO) => {
      switch (e.data.status) {
        case "initiate":
          // Model file start load: add a new progress item to the list.
          progressItems.push(e.data)
          break

        case "progress":
          // Model file progress: update one of the progress items.
          progressItems = progressItems.map((item: TODO) => {
            if (item.file === e.data.file) {
              return { ...item, progress: e.data.progress }
            }

            return item
          })
          break

        case "done":
          // Model file loaded: remove the progress item from the list.
          progressItems = progressItems.filter((item: TODO) => item.file !== e.data.file)
          break

        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          // ready = true
          break

        case "complete":
          ui.textToSpeechAudioBlob = URL.createObjectURL(e.data.output)
          ui.textToSpeechLoading = false
          break
      }
    }

    ttsWorker?.addEventListener("message", onMessageReceived)

    return () => ttsWorker?.removeEventListener("message", onMessageReceived)
  })
}

export const handleGenerateSpeech = async (text: string) => {
  if (!ui.aiFeaturesPreferences.tts.enabled) {
    return
  }
  if (ui.aiFeaturesPreferences.tts.location === TTSLocation.Server) {
    const ttsResponse = await fetch("/api/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        speaker: ui.aiFeaturesPreferences.tts.speaker,
        text,
      }),
    })
    const ttsBlob = await ttsResponse.blob()
    const blobUrl = URL.createObjectURL(ttsBlob)
    ui.textToSpeechAudioBlob = blobUrl
    return
  }

  if (
    !ttsWorker ||
    !ui.aiFeaturesPreferences.tts.enabled ||
    ui.aiFeaturesPreferences.tts.location !== TTSLocation.Browser
  ) {
    return
  }

  ui.textToSpeechLoading = true
  ttsWorker.postMessage({
    text,
  })
}
