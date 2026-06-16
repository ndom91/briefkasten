import {
  AutoTokenizer,
  env,
  SpeechT5ForTextToSpeech,
  SpeechT5HifiGan,
  Tensor,
} from "@xenova/transformers"
import { encodeWAV } from "./utils"

env.allowLocalModels = false
env.useBrowserCache = true

// Use the Singleton pattern to enable lazy construction of the pipeline.
class MyTextToSpeechPipeline {
  static BASE_URL =
    "https://huggingface.co/datasets/Xenova/cmu-arctic-xvectors-extracted/resolve/main/"

  static model_id = "Xenova/speecht5_tts"
  static vocoder_id = "Xenova/speecht5_hifigan"

  static tokenizer_instance = null
  static model_instance = undefined
  static vocoder_instance = undefined

  static async getInstance(progress_callback = undefined) {
    if (MyTextToSpeechPipeline.tokenizer_instance === null) {
      MyTextToSpeechPipeline.tokenizer = AutoTokenizer.from_pretrained(
        MyTextToSpeechPipeline.model_id,
        { progress_callback }
      )
    }

    if (MyTextToSpeechPipeline.model_instance === undefined) {
      MyTextToSpeechPipeline.model_instance = SpeechT5ForTextToSpeech.from_pretrained(
        MyTextToSpeechPipeline.model_id,
        {
          quantized: false,
          progress_callback,
        }
      )
    }

    if (MyTextToSpeechPipeline.vocoder_instance === undefined) {
      MyTextToSpeechPipeline.vocoder_instance = SpeechT5HifiGan.from_pretrained(
        MyTextToSpeechPipeline.vocoder_id,
        {
          quantized: false,
          progress_callback,
        }
      )
    }

    return new Promise(async (resolve) => {
      const result = await Promise.all([
        MyTextToSpeechPipeline.tokenizer,
        MyTextToSpeechPipeline.model_instance,
        MyTextToSpeechPipeline.vocoder_instance,
      ])
      self.postMessage({
        status: "ready",
      })
      resolve(result)
    })
  }

  // static async getSpeakerEmbeddings(speaker_id) {
  //   // e.g., `cmu_us_awb_arctic-wav-arctic_a0001`
  //   const speaker_embeddings_url = `${this.BASE_URL}${speaker_id}.bin`
  //   const speaker_embeddings = new Tensor(
  //     "float32",
  //     new Float32Array(await (await fetch(speaker_embeddings_url)).arrayBuffer()),
  //     [1, 512],
  //   )
  //   return speaker_embeddings
  // }
}

// Mapping of cached speaker embeddings
// const speaker_embeddings_cache = new Map()

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Load the pipeline
  const [tokenizer, model, vocoder] = await MyTextToSpeechPipeline.getInstance((x) => {
    // We also add a progress callback so that we can track model loading.
    self.postMessage(x)
  })

  // Tokenize the input
  const { input_ids } = tokenizer(event.data.text)

  // Load the speaker embeddings
  // let speaker_embeddings = speaker_embeddings_cache.get(event.data.speaker_id)
  // if (speaker_embeddings === undefined) {
  //   speaker_embeddings = await MyTextToSpeechPipeline.getSpeakerEmbeddings(event.data.speaker_id)
  //   speaker_embeddings_cache.set(event.data.speaker_id, speaker_embeddings)
  // }

  const speaker_embeddings_data = new Float32Array(
    await (
      await fetch(
        "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin"
      )
    ).arrayBuffer()
  )
  const speaker_embeddings = new Tensor("float32", speaker_embeddings_data, [
    1,
    speaker_embeddings_data.length,
  ])

  // Generate the waveform
  const { waveform } = await model.generate_speech(input_ids, speaker_embeddings, { vocoder })

  // Encode the waveform as a WAV file
  const wav = encodeWAV(waveform.data)

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: new Blob([wav], { type: "audio/wav" }),
  })
})
