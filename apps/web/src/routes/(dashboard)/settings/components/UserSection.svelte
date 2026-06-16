<script lang="ts">
import { format } from "@formkit/tempo"
import { toast } from "svelte-sonner"
import { Badge } from "$/lib/components/ui/badge"
import { page } from "$app/state"
import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
import { Button } from "$lib/components/ui/button"
import * as Card from "$lib/components/ui/card"
import { Checkbox } from "$lib/components/ui/checkbox"
import * as Select from "$lib/components/ui/select"
import { Separator } from "$lib/components/ui/separator"
import * as Table from "$lib/components/ui/table"
import { defaultAISettings, TTSLocation } from "$lib/state/ui.svelte"
import { clipboard } from "$lib/utils/clipboard"
import { parseChromeBookmarks, parsePocketBookmarks } from "../import"
import {
  bookmarkTypes,
  exportBookmarks,
  importBookmarks,
  type ParsedBookmark,
  parseImportFile,
} from "../utils"

let exportLoading = $state(false)
let importLoading = $state(false)

const userSettings = page.data.user?.settings ?? {
  ai: {
    tts: defaultAISettings?.tts,
    summarization: defaultAISettings?.summarization,
  },
  personal: {},
}

let ttsEnabled = $state(userSettings.ai?.tts.enabled)
let ttsSpeaker = $state(userSettings.ai?.tts.speaker)
let ttsLocation = $state(userSettings.ai?.tts.location)
let summarizationEnabled = $state(userSettings.ai?.summarization.enabled)
let personalSettings = $state(userSettings.personal)

type UpdateUserSettingsArgs = {
  ttsEnabled: boolean
  ttsSpeaker: string
  ttsLocation: string
  summarizationEnabled: boolean
  personal: Record<string, unknown>
  // transcriptionEnabled: boolean
}

const updateUser = async (userSettings: UpdateUserSettingsArgs) => {
  const response = await fetch("/api/v1/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        settings: {
          personal: {
            compact: userSettings.personal?.compact,
          },
          ai: {
            tts: {
              enabled: userSettings.ttsEnabled,
              speaker: userSettings.ttsSpeaker,
              location: userSettings.ttsLocation,
            },
            summarization: {
              enabled: userSettings.summarizationEnabled,
            },
            // transcription: {
            //   enabled: userSettings.transcriptionEnabled,
            // },
          },
        },
      },
    }),
  })
  if (!response.ok) {
    toast.error(`Settings update failed: ${await response.text()}`)
    return
  }

  // TODO: Reenable when not running onMount
  toast.success("Settings updated")
}

const speakers = [
  "en-US-AriaNeural",
  "en-US-AnaNeural",
  "en-US-ChristopherNeural",
  "en-US-EricNeural",
  "en-US-GuyNeural",
  "en-US-JennyNeural",
  "en-US-MichelleNeural",
  "en-US-RogerNeural",
  "en-US-SteffanNeural",
]

const ttsLocationItems = Object.values(TTSLocation).map((location) => ({
  value: location,
  label: location,
}))

// Import Bookmarks
let importFile = $state<FileList | null>(null)
let parsedBookmarks = $state<ParsedBookmark[] | undefined>([])

$effect(() => {
  if (!importFile?.[0]) {
    return
  }
  const fileReader = new FileReader()
  fileReader.readAsText(importFile[0])
  fileReader.onloadend = () => {
    const htmlFile = fileReader.result as string | null
    if (!htmlFile) {
      return
    }

    const parsedFile = parseImportFile(htmlFile)
    if (!parsedFile) {
      return
    }

    if (parsedFile.type === bookmarkTypes.POCKET) {
      parsedBookmarks = parsePocketBookmarks(parsedFile.doc).filter(
        (b): b is NonNullable<typeof b> => b != null
      )
    } else if (parsedFile.type === bookmarkTypes.CHROME) {
      // Default Chrome format
      const chromeBookmarks = parseChromeBookmarks(parsedFile.doc).filter(
        (b): b is NonNullable<typeof b> => b != null
      )
      if (!chromeBookmarks?.[0]?.title) {
        return
      }
      parsedBookmarks = chromeBookmarks
    }
  }
})

const handleImport = async () => {
  importLoading = true
  try {
    if (!parsedBookmarks?.length) {
      toast.error(`No bookmarks successfully parsed. See console for any potential errors.`)
      return
    }
    await importBookmarks(parsedBookmarks)
    parsedBookmarks = []
  } catch (error) {
    console.error(error)
    toast.error(`Import failed ${String(error)}`)
  } finally {
    importLoading = false
  }
}

const handleBookmarkExport = () => {
  exportLoading = true
  exportBookmarks(page.data.bookmarks.data)
  exportLoading = false
}

async function handleSummarizationToggle() {
  summarizationEnabled = !summarizationEnabled
  await updateUser({
    ttsEnabled,
    ttsSpeaker: ttsSpeaker.trim(),
    ttsLocation: ttsLocation.trim(),
    summarizationEnabled,
    // transcriptionEnabled: transcriptionEnabled,
    personal: personalSettings,
  })
}

async function handleTTSToggle() {
  ttsEnabled = !ttsEnabled
  await updateUser({
    ttsEnabled,
    ttsSpeaker: ttsSpeaker.trim(),
    ttsLocation: ttsLocation.trim(),
    summarizationEnabled,
    // transcriptionEnabled: transcriptionEnabled,
    personal: personalSettings,
  })
}

async function toggleSetting(setting: string) {
  personalSettings[setting] = !personalSettings[setting]
  await updateUser({
    ttsEnabled,
    ttsSpeaker: ttsSpeaker.trim(),
    ttsLocation: ttsLocation.trim(),
    summarizationEnabled,
    // transcriptionEnabled: transcriptionEnabled,
    personal: personalSettings,
  })
}
</script>

<div class="flex h-full flex-col items-start justify-start gap-2">
  <Card.Root class="w-full rounded-md shadow-none bg-neutral-100 dark:bg-neutral-800">
    <Card.Header class="rounded-t-md">
      <Card.Title class="flex w-full items-center justify-between">
        <span class="font-normal">General</span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-2 md:flex-row md:items-center">
        <span>
          For use in the <a
            href="https://docs.briefkastenhq.com"
            target="_blank"
            class="underline underline-offset-4"
          >
            Briefkasten Extension</a
          >
          you can use the following token:
        </span>
        <div
          class="flex items-center justify-between rounded-md bg-neutral-100 p-2 font-mono dark:bg-neutral-700"
        >
          {page.data?.session?.user?.id}
          <button
            aria-label="Copy"
            use:clipboard={page.data?.session?.user?.id ?? ""}
            class="h-8 rounded-md bg-transparent p-1 outline-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            <svg
              class="size-4"
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Separator class="my-5" />
      <div class="flex flex-col items-start gap-2 md:flex-row md:items-center">
        <div class="flex items-start gap-4">
          <Checkbox
            id="compact"
            class="mt-1"
            checked={personalSettings?.compact ?? false}
            onCheckedChange={() => toggleSetting("compact")}
          />
          <div>
            <label for="compact" class="">
              <div class="text-lg hover:cursor-pointer">Compact Mode</div>
              <div class="text-neutral-500">
                In mobile view, remove bookmark images and paddings, etc.
              </div>
            </label>
          </div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full rounded-md shadow-none bg-neutral-100 dark:bg-neutral-800">
    <Card.Header class="rounded-t-md">
      <Card.Title class="flex w-full items-center justify-between">
        <span class="font-normal">AI Settings</span>
        <Badge class="text-sm">Experimental</Badge>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-4">
        <p>
          You can manage all of your AI features here. All of these AI features that run in the
          browser are enabled by the <a
            class="underline underline-offset-4"
            href="https://github.com/xenova/transformers.js">transformers.js</a
          >
          library from
          <a class="underline underline-offset-4" href="https://huggingface.co" target="_blank"
            >Huggingface</a
          >, meaning
          <b>the models are downloaded locally and run in your browser</b> when selecting "Read Aloud"
          on an RSS feed ite, for example.
        </p>
        <p>
          That has the advantage of significantly increased security and no need for a third-party
          API key. However, it also comes with some disadvantages like lower performance and longer
          inference times. So be aware, the AI features are all in an experimental stage, but we
          really wanted to share them with you all already anyway!
        </p>
        <div class="flex flex-col items-start gap-4">
          <div class="flex items-start gap-4">
            <Checkbox
              id="summarization"
              class="mt-1"
              checked={summarizationEnabled}
              onCheckedChange={handleSummarizationToggle}
            />
            <div>
              <label for="summarization" class="">
                <div class="text-lg hover:cursor-pointer">Summarization</div>
                <div class="text-neutral-500">
                  Our summaries feature is using the <code>Xenova/distilbart-cnn-6-6</code> model and
                  takes about ~30s on average to summarize a medium length article. We recommend this
                  one for day-to-day use.
                </div>
              </label>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <Checkbox
              class="mt-1"
              id="tts"
              checked={ttsEnabled}
              onCheckedChange={handleTTSToggle}
            />
            <div>
              <div class="flex flex-col gap-4">
                <label for="tts" class="flex flex-col gap-2">
                  <div class="text-lg hover:cursor-pointer dark:text-neutral-50">
                    Text to Speech
                  </div>
                  <p class="text-neutral-500">
                    In the browser, our text-to-speech (TTS) feature is using the <code
                      >Xenova/speecht5_tts</code
                    > model and takes about ~10s on average to generate good quality voice audio for
                    each sentence of text. Therefore, this option is really only good for experimentation
                    at this point.
                  </p>
                  <p class="text-neutral-500">
                    However, we also support a "Server" mode which leverages the Edge browser LLM
                    APIs for text-to-speech generation. This not only performs significantly better,
                    but it also supports choosing one of a dozen voices. You can adjust the method
                    (browser / server) below, as well as select a voice if you've chosen the server
                    text-to-speed option.
                  </p>
                </label>
                <div
                  class="flex flex-col items-start justify-start gap-2 md:flex-row md:items-center"
                >
                  <div class="flex w-56 flex-col gap-2">
                    <label
                      for="ttsLocation"
                      class="data-invalid:text-destructive text-sm font-medium leading-none text-neutral-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-neutral-50"
                      >Method</label
                    >
                    <Select.Root
                      name="ttsLocation"
                      type="single"
                      onValueChange={async (v: string) => {
                        ttsLocation = v
                        await updateUser({
                          ttsEnabled,
                          ttsSpeaker: ttsSpeaker.trim(),
                          ttsLocation: ttsLocation.trim(),
                          summarizationEnabled,
                          personal: personalSettings,
                        })
                      }}
                    >
                      <Select.Trigger
                        class="w-full enabled:bg-neutral-100 disabled:cursor-not-allowed enabled:dark:bg-neutral-900 disabled:dark:bg-neutral-700"
                      >
                        {ttsLocation || "TTS Inference Location"}
                      </Select.Trigger>
                      <Select.Content>
                        {#each ttsLocationItems as location (location.value)}
                          <Select.Item value={location.value}>{location.label}</Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                    <input type="hidden" name="ttsLocation" value={ttsLocation} />
                  </div>
                  <div class="flex w-56 flex-col gap-2">
                    <label
                      for="ttsSpeaker"
                      class="data-invalid:text-destructive text-sm font-medium leading-none text-neutral-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-neutral-50"
                    >
                      Voice
                    </label>
                    <Select.Root
                      name="ttsSpeaker"
                      type="single"
                      disabled={ttsLocation !== TTSLocation.Server}
                      onValueChange={async (v: string) => {
                        ttsSpeaker = v
                        await updateUser({
                          ttsEnabled,
                          ttsSpeaker: ttsSpeaker.trim(),
                          ttsLocation: ttsLocation.trim(),
                          summarizationEnabled,
                          personal: personalSettings,
                        })
                      }}
                    >
                      <Select.Trigger
                        class="w-full enabled:bg-neutral-100 disabled:cursor-not-allowed enabled:dark:bg-neutral-900 disabled:dark:bg-neutral-700"
                      >
                        {ttsSpeaker || "Speaker"}
                      </Select.Trigger>
                      <Select.Content>
                        {#each speakers as speaker (speaker)}
                          <Select.Item value={speaker}>{speaker}</Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                    <input type="hidden" name="ttsSpeaker" value={ttsSpeaker} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="flex gap-4 items-center"> -->
          <!--   <Checkbox id="transcriber" bind:checked={transcriptionEnabled} /> -->
          <!--   <label for="transcriber" class=""> -->
          <!--     <div class="text-xl">Transcriber</div> -->
          <!--     <div class="text-neutral-400 dark:text-neutral-500"> -->
          <!--       Our speech to text (transcriber) feature is using the <code -->
          <!--         >Xenova/whisper-tiny</code -->
          <!--       > -->
          <!--       model and takes about ~20s on average after recording has stopped to generate a fairly -->
          <!--       accurate transcription. We feel comfortable recommending this one for daily use in notes. -->
          <!--       Note: We currently only support transcription in <b>English</b>. -->
          <!--     </div> -->
          <!--   </label> -->
          <!-- </div> -->
        </div>
      </div>
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full rounded-md bg-neutral-100 dark:bg-neutral-800 shadow-none">
    <Card.Header class="rounded-t-md">
      <Card.Title class="flex w-full items-center justify-between">
        <span class="font-normal">Import</span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-4">
        <p>
          Upload a bookmarks HTML file exported from another tool, or your browser. After the file
          has been uploaded and its name appears in the upload widget, you can press Import to start
          the import process.
        </p>
        <input
          accept="text/html"
          id="import-bookmarks"
          type="file"
          class="border-input ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-72 rounded-md border bg-neutral-100 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-900"
          bind:files={importFile}
        />
      </div>
      {#if parsedBookmarks && parsedBookmarks.length > 1}
        <div class="mt-4 flex flex-col gap-4 rounded-sm bg-neutral-50 dark:bg-neutral-900">
          <div
            class="flex items-center justify-between gap-1 rounded-t-sm bg-neutral-100 p-4 dark:bg-neutral-800"
          >
            <h3>Preview</h3>
            <div>{parsedBookmarks.length} bookmarks detected</div>
          </div>
          <div class="rounded-sm p-4">
            <Table.Root class="rounded-sm border dark:border-neutral-800">
              <Table.Header>
                <Table.Row class="hover:bg-transparent!">
                  <Table.Head class="min-w-48 w-1/4">Title</Table.Head>
                  <Table.Head>URL</Table.Head>
                  <Table.Head class="text-right">Created At</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each parsedBookmarks.slice(0, 5) as bookmark (bookmark.url)}
                  <Table.Row class=" hover:bg-neutral-300/30! hover:dark:bg-neutral-950/30!">
                    <Table.Cell class="font-medium">{bookmark.title}</Table.Cell>
                    <Table.Cell>{bookmark.url}</Table.Cell>
                    <Table.Cell class="text-right">
                      {format(String(bookmark.createdAt), "medium")}
                    </Table.Cell>
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </div>
          <Button disabled={importLoading} class="mx-auto mb-4 w-96" onclick={handleImport}>
            Looks good, Import all {parsedBookmarks?.length}!
          </Button>
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
  <Card.Root class="w-full rounded-md  bg-neutral-100 dark:bg-neutral-800 shadow-none">
    <Card.Header class="rounded-t-md">
      <Card.Title class="flex w-full items-center justify-between">
        <span>Export</span>
      </Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col items-start gap-4">
        <p>
          Save your bookmarks from Briefkasten to an html file. This is a standardized bookmarks
          format which you can use to import your saved items to any other bookmarks manager or
          browser.
        </p>
        <Button onclick={handleBookmarkExport} disabled={exportLoading}>
          {#if exportLoading}
            <LoadingIndicator class="mr-2" />
          {/if}
          Export Bookmark File
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
</div>
