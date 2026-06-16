<script lang="ts">
const initBars = Array.from({ length: 10 }, () => Math.random() * 0.8 + 0.2)

const { paused }: { paused: boolean } = $props()
const bars = $state(initBars)

let interval: ReturnType<typeof setInterval>
$effect(() => {
  if (interval) {
    return
  }
  interval = setInterval(() => {
    if (paused) {
      return
    }
    bars.forEach((_, i) => {
      bars[i] = Math.random() * 0.8 + 0.2
    })
  }, 150)
  return () => clearInterval(interval)
})
</script>

{#each bars as _, i}
  <div
    class={`rounded-lg move${i + 1} max-h-[52px] transition-transform ease-in-out duration-100 bg-red-400 w-2`}
    style={`animation-play-state: ${paused ? "paused" : "running"}`}
  ></div>
{/each}

<style>
  @keyframes scale-height10 {
    35% {
      transform: scaleY(0.15);
    }
    73% {
      transform: scaleY(0.89);
    }
  }
  @keyframes scale-height9 {
    41% {
      transform: scaleY(0.5);
    }
    91% {
      transform: scaleY(0.91);
    }
  }
  @keyframes scale-height8 {
    4% {
      transform: scaleY(0.29);
    }
    63% {
      transform: scaleY(0.83);
    }
  }
  @keyframes scale-height7 {
    37% {
      transform: scaleY(0.23);
    }
    91% {
      transform: scaleY(0.9);
    }
  }
  @keyframes scale-height6 {
    20% {
      transform: scaleY(0.4);
    }
    40% {
      transform: scaleY(0.8);
    }
  }
  @keyframes scale-height5 {
    20% {
      transform: scaleY(0.1);
    }
    80% {
      transform: scaleY(1);
    }
  }
  @keyframes scale-height4 {
    10% {
      transform: scaleY(0.4);
    }
    70% {
      transform: scaleY(1);
    }
  }
  @keyframes scale-height3 {
    15% {
      transform: scaleY(0.4);
    }
    94% {
      transform: scaleY(1);
    }
  }
  @keyframes scale-height2 {
    0% {
      transform: scaleY(0.1);
    }
    74% {
      transform: scaleY(0.7);
    }
  }
  @keyframes scale-height1 {
    0% {
      transform: scaleY(0.5);
    }
    89% {
      transform: scaleY(0.9);
    }
  }

  .move1 {
    animation: scale-height1 1s linear alternate infinite;
  }
  .move2 {
    animation: scale-height2 1s linear alternate infinite;
  }
  .move3 {
    animation: scale-height3 1s linear alternate infinite;
  }
  .move4 {
    animation: scale-height4 1s linear alternate infinite;
  }
  .move5 {
    animation: scale-height5 1s linear alternate infinite;
  }
  .move6 {
    animation: scale-height6 1s linear alternate infinite;
  }
  .move7 {
    animation: scale-height7 1s linear alternate infinite;
  }
  .move9 {
    animation: scale-height8 1s linear alternate infinite;
  }
  .move9 {
    animation: scale-height9 1s linear alternate infinite;
  }
  .move10 {
    animation: scale-height10 1s linear alternate infinite;
  }
</style>
