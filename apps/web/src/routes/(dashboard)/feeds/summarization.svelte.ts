import { toast } from "svelte-sonner"
import { useInterface } from "$lib/state/ui.svelte"
import summaryWorkerUrl from "$lib/transformers/summary-worker?url"

const ui = useInterface()

let summaryWorker = $state<Worker>()

export const registerSummarizationWorker = () => {
  $effect(() => {
    if (!summaryWorker && ui.aiFeaturesPreferences.summarization.enabled) {
      summaryWorker = new Worker(new URL(summaryWorkerUrl, import.meta.url), {
        type: "module",
      })
    }

    const onMessageReceived = (e: TODO) => {
      switch (e.data.status) {
        case "complete":
          ui.summarizationLoading = false
          // TODO: UI to display summary
          toast.success(e.data.output, { duration: 10000 })
          console.log("Summary:", e.data.output)
          break
      }
    }

    summaryWorker?.addEventListener("message", onMessageReceived)

    return () => summaryWorker?.removeEventListener("message", onMessageReceived)
  })
}

export const handleSummarizeText = (text: string) => {
  if (!summaryWorker || !ui.aiFeaturesPreferences.summarization.enabled) {
    return
  }
  ui.summarizationLoading = true
  summaryWorker.postMessage({
    text,
  })
}
