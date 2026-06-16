import { execSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { sveltekit } from "@sveltejs/kit/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, type Rollup } from "vite"
import devtoolsJson from "vite-plugin-devtools-json"

function bumpManifestPlugin() {
  return {
    name: "bump-manifest",
    outputOptions(options: Rollup.OutputOptions) {
      const cwd = import.meta.dirname
      const version = execSync("git rev-parse HEAD").toString().trim().substring(0, 7)
      const manifestPath = join(cwd, "static", "manifest.webmanifest")
      const contentsStr = readFileSync(manifestPath).toString()
      const contents = JSON.parse(contentsStr)

      contents.id = `briefkasten-${version}`
      writeFileSync(manifestPath, `${JSON.stringify(contents, null, 2)}\n`)
      return options
    },
  }
}

export default defineConfig({
  plugins: [sveltekit(), tailwindcss(), devtoolsJson()],
  server: { host: "0.0.0.0" },
  build: {
    rollupOptions: { plugins: [bumpManifestPlugin()] },
  },
})
