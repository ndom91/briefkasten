import { env, pipeline } from "@xenova/transformers"

env.allowLocalModels = false
env.useBrowserCache = true

self.addEventListener("message", async (event) => {
  // Xenova/m2m100_418M
  // Xenova/nllb-200-distilled-600M
  // Xenova/mbart-large-50-many-to-many-mmt
  const translator = await pipeline("translation", "Xenova/mbart-large-50-many-to-many-mmt")
  const output = await translator(event.data.text, {
    src_lang: "en_XX",
    tgt_lang: "de_DE",
  })

  self.postMessage({
    status: "complete",
    output: output,
  })
})
