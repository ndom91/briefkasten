<script lang="ts">
import { watch } from "runed"
import { tick } from "svelte"
import { cn } from "$/lib/utils"
import { useInterface } from "$lib/state/ui.svelte"
import AudioVisualizer from "./AudioVisualizer.svelte"

const { src }: { src: string } = $props()

const ui = useInterface()

let paused = $state(false)
let currentTime = $state(0)
let playbackRate = $state(1)
let ended = $state(false)

watch(
  () => ended,
  () => {
    if (ended) {
      ui.textToSpeechAudioBlob = ""
    }
  }
)

const togglePlaybackRate = () => {
  if (playbackRate === 1) {
    playbackRate = 1.2
  } else if (playbackRate === 1.2) {
    playbackRate = 1.5
  } else if (playbackRate === 1.5) {
    playbackRate = 0.8
  } else {
    playbackRate = 1
  }
}

let windowWidth: number = $state(1000)

const seek = (dur: number) => {
  paused = true
  tick()
    .then(() => {
      currentTime = currentTime + dur
    })
    .then(() => {
      paused = false
    })
    .catch((err) => console.error(err))
}
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div
  class={cn(
    "relative flex  items-stretch rounded-md bg-neutral-900",
    windowWidth < 768 ? "fixed bottom-6 left-1/2 z-30 -translate-x-1/2 shadow-md" : "",
  )}
>
  <audio
    {src}
    bind:currentTime
    bind:ended
    bind:playbackRate
    bind:paused
    class="hidden"
    autoplay={true}
  ></audio>
  <button
    onclick={() => (paused = !paused)}
    class={cn(
      "outline-none rounded-l-md flex justify-center items-center",
      windowWidth < 768 ? "w-16 bg-neutral-200 dark:bg-red-300/30" : "gap-2 py-2 px-3",
    )}
  >
    {#if !paused}
      <svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" /><rect
          x="152"
          y="40"
          width="56"
          height="176"
          rx="8"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><rect
          x="48"
          y="40"
          width="56"
          height="176"
          rx="8"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
    {:else}
      <svg class="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" /><path
          d="M72,39.88V216.12a8,8,0,0,0,12.15,6.69l144.08-88.12a7.82,7.82,0,0,0,0-13.38L84.15,33.19A8,8,0,0,0,72,39.88Z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
    {/if}
  </button>
  <div
    class={cn(
      "flex relative items-center bg-neutral-900 rounded-r-md",
      windowWidth < 768 ? "gap-6 py-4 px-5" : "gap-3 py-2 px-3",
    )}
  >
    <button class="flex flex-col items-center" title="Skip backward 20s" onclick={() => seek(-20)}>
      <svg class="size-5 scale-x-[-1]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" /><polyline
          points="128 80 128 128 168 152"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><polyline
          points="184 104 224 104 224 64"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><path
          d="M188.4,192a88,88,0,1,1,1.83-126.23C202,77.69,211.72,88.93,224,104"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
      <div class="text-[0.65rem]">20s</div>
    </button>
    <div class="flex h-10 gap-1">
      <AudioVisualizer {paused} />
    </div>
    <button class="flex flex-col items-center" title="Skip forward 20s" onclick={() => seek(20)}>
      <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" /><polyline
          points="128 80 128 128 168 152"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><polyline
          points="184 104 224 104 224 64"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><path
          d="M188.4,192a88,88,0,1,1,1.83-126.23C202,77.69,211.72,88.93,224,104"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
      <div class="text-[0.65rem]">20s</div>
    </button>
    <button
      class="flex flex-col items-center justify-end"
      title="Skip forward 20s"
      onclick={togglePlaybackRate}
    >
      <svg class="size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <rect width="256" height="256" fill="none" /><path
          d="M24,184V161.13C24,103.65,70.15,56.2,127.63,56A104,104,0,0,1,232,160v24a8,8,0,0,1-8,8H32A8,8,0,0,1,24,184Z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><line
          x1="128"
          y1="56"
          x2="128"
          y2="88"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><line
          x1="104"
          y1="192"
          x2="168"
          y2="104"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><line
          x1="200"
          y1="144"
          x2="230.78"
          y2="144"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /><line
          x1="25.39"
          y1="144"
          x2="56"
          y2="144"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="16"
        /></svg
      >
      <div class="text-[0.65rem]">{playbackRate.toFixed(1)}</div>
    </button>

    {#if windowWidth < 768}
      <button aria-label="Stop" onclick={() => (ui.textToSpeechAudioBlob = "")}>
        <svg
          class="size-6"
          data-slot="icon"
          fill="none"
          stroke-width="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
        </svg>
      </button>
    {/if}
  </div>
</div>
