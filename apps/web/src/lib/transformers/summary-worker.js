import { env, pipeline } from "@xenova/transformers"

env.allowLocalModels = false
env.useBrowserCache = true

self.addEventListener("message", async (event) => {
  const generator = await pipeline("summarization", "Xenova/distilbart-cnn-6-6")
  const output = await generator(event.data.text, {
    max_new_tokens: 200,
  })

  self.postMessage({
    status: "complete",
    output: output[0].summary_text,
  })
})
