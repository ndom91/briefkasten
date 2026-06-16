/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Provider {
  id: string
  name: string
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  interface Locals {
    providers: Provider[]
    session: import("better-auth/svelte-kit").Session
    user: import("better-auth/svelte-kit").User
  }
  // interface Platform {}
  // interface PrivateEnv {}
  // interface PublicEnv {}
}
