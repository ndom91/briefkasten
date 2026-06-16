<script lang="ts">
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
import type { DateRange } from "bits-ui"
import { Button } from "$lib/components/ui/button/index.js"
import * as Popover from "$lib/components/ui/popover/index.js"
import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js"
import * as Select from "$lib/components/ui/select/index.js"
import { cn } from "$lib/utils"

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
})

let dateRange = $state<DateRange>({
  start: today(getLocalTimeZone()).subtract({ days: 3 }),
  end: today(getLocalTimeZone()),
})
const userLocale: string = $state(new Intl.NumberFormat().resolvedOptions().locale ?? "en-us")

const items = [
  { value: "3", label: "Last 3 Days" },
  { value: "7", label: "Last Week" },
  { value: "30", label: "Last Month" },
]
</script>

<div class="grid gap-2 grow">
  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          class={cn(
            "w-fit justify-start text-left font-normal bg-neutral-100 dark:bg-neutral-900 ",
            !dateRange.start && !dateRange.end && "text-muted-foreground",
          )}
        >
          <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"
            ><rect width="256" height="256" fill="none" /><rect
              x="40"
              y="40"
              width="176"
              height="176"
              rx="8"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><line
              x1="176"
              y1="24"
              x2="176"
              y2="56"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><line
              x1="80"
              y1="24"
              x2="80"
              y2="56"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><line
              x1="40"
              y1="88"
              x2="216"
              y2="88"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            /><circle cx="128" cy="132" r="12" /><circle cx="172" cy="132" r="12" /><circle
              cx="84"
              cy="172"
              r="12"
            /><circle cx="128" cy="172" r="12" /><circle cx="172" cy="172" r="12" /></svg
          >
          {#if dateRange.start}
            {#if dateRange.end}
              {df.format(dateRange.start.toDate(getLocalTimeZone()))} - {df.format(
                dateRange.end.toDate(getLocalTimeZone()),
              )}
            {:else}
              {df.format(dateRange.start.toDate(getLocalTimeZone()))}
            {/if}
          {:else}
            Pick a date
          {/if}
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-2 space-y-2" align="start">
      <Select.Root
        type="single"
        onValueChange={(v: string) => {
          dateRange.start = today(getLocalTimeZone()).subtract({ days: Number(v) })
          dateRange.end = today(getLocalTimeZone())
        }}
      >
        <Select.Trigger>
          {items[0]?.label}
        </Select.Trigger>
        <Select.Content>
          {#each items as item}
            <Select.Item value={item.value}>{item.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <RangeCalendar locale={userLocale} bind:value={dateRange} />
    </Popover.Content>
  </Popover.Root>
</div>
