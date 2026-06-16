import { execSync } from "node:child_process"
import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  serviceWorker: {
    register: false,
  },
  kit: {
    adapter: adapter(),
    version: {
      name: execSync("git rev-parse HEAD").toString().trim().substring(0, 7),
    },
    alias: {
      $: "src",
      $stores: "src/stores",
      $assets: "src/lib/assets",
      $schemas: "src/lib/schemas",
      $server: "src/server",
      $lib: "src/lib",
      $state: "src/state",
      $types: "src/lib/types",
    },
  },
}

export default config
