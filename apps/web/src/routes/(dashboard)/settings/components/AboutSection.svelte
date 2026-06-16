<script lang="ts">
import * as Card from "$lib/components/ui/card"
</script>

<div class="flex flex-col gap-2 justify-start items-start">
  <Card.Root class="w-full shadow-none rounded-md bg-transparent">
    <Card.Header class="bg-neutral-100 dark:bg-neutral-800 rounded-t-md">
      <Card.Title>About</Card.Title>
    </Card.Header>
    <Card.Content class="p-4">
      <div class="flex flex-col gap-4 items-start">
        <p>
          This is an open-source project written mainly by <a
            href="https://ndo.dev"
            target="blank"
            class="underline underline-offset-4">ndom91</a
          >. More information can be found at the links below.
        </p>
        <ul class="list-disc list-inside">
          <li>
            Repository: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten"
              target="_blank">ndom91/briefkasten</a
            >
          </li>
          <li>
            Screenshot API: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten-screenshot"
              target="_blank">ndom91/briefkasten-screenshot</a
            >
          </li>
          <li>
            Chrome Extension: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten-extension"
              target="_blank">ndom91/briefkasten-extension</a
            >
          </li>
          <li>
            Missing Image Scraping Job: <a
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten-scrape"
              target="_blank">ndom91/briefkasten-scrape</a
            >
          </li>
          <li>
            License: <a
              target="_blank"
              class="font-mono font-bold"
              href="https://github.com/ndom91/briefkasten/blob/main/LICENSE">MIT</a
            >
          </li>
        </ul>
      </div>
    </Card.Content>
  </Card.Root>
</div>
