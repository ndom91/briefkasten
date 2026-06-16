import type { Category, Tag } from "$lib/types/zod.js"

export const TTSLocation = {
  Browser: "Browser",
  Server: "Server",
} as const

type TTSLocation = keyof typeof TTSLocation

interface AIFeaturesPreferences {
  tts: {
    enabled: boolean
    location: TTSLocation
    speaker: string
  }
  summarization: {
    enabled: boolean
  }
  transcription: {
    enabled: boolean
  }
}

interface MetadataSidebarData {
  bookmark?: LoadBookmarkFlatTags
  // categories?: (Category & { description: string | undefined })[]
  categories?: Category[]
  tags?: Tag[]
}

// Search
const searching = $state(false)
let searchQuery = $state("")

// Feed Page
let showUnreadOnly = $state(false)
let filteredFeeds = $state([])

// Sidebars
let metadataSidebarOpen = $state(false)
let metadataSidebarData = $state<MetadataSidebarData>({
  bookmark: undefined,
  categories: [],
  tags: [],
})
let metadataSidebarEditMode = $state(false)
let userSidebarOpen = $state(false)
let quickAddOpen = $state(false)

// AI Features
let textToSpeechContent = $state("")
let textToSpeechAudioBlob = $state("")
let textToSpeechLoading = $state(false)
let summarizationLoading = $state(false)
let summarizationContent = $state("")

export const defaultAISettings = {
  tts: {
    enabled: true,
    location: TTSLocation.Server,
    speaker: "en-US-GuyNeural",
  },
  summarization: {
    enabled: true,
  },
  transcription: {
    enabled: true,
  },
}

let aiFeaturesPreferences = $state<AIFeaturesPreferences>(defaultAISettings)

let userSettings = $state<Record<string, unknown>>({})

export function useInterface() {
  return {
    // User Settings
    get userSettings() {
      return userSettings
    },
    set userSettings(data) {
      userSettings = data
    },
    // Search
    get searching() {
      return searching
    },
    get searchQuery() {
      return searchQuery
    },
    set searchQuery(query) {
      searchQuery = query
    },
    updateSearchQuery: (e: string): string => (searchQuery = e),

    // Feed Page
    get showUnreadOnly() {
      return showUnreadOnly
    },
    set showUnreadOnly(query) {
      showUnreadOnly = query
    },
    get filteredFeeds() {
      return filteredFeeds
    },
    set filteredFeeds(query) {
      filteredFeeds = query
    },

    // LLM TTS
    get textToSpeechContent() {
      return textToSpeechContent
    },
    set textToSpeechContent(query) {
      textToSpeechContent = query
    },
    get textToSpeechAudioBlob() {
      return textToSpeechAudioBlob
    },
    set textToSpeechAudioBlob(query) {
      textToSpeechAudioBlob = query
    },
    get textToSpeechLoading() {
      return textToSpeechLoading
    },
    set textToSpeechLoading(query) {
      textToSpeechLoading = query
    },
    // LLM Settings
    get aiFeaturesPreferences() {
      return aiFeaturesPreferences
    },
    set aiFeaturesPreferences(query) {
      aiFeaturesPreferences = query
    },

    // LLM Summarization
    get summarizationLoading() {
      return summarizationLoading
    },
    set summarizationLoading(query) {
      summarizationLoading = query
    },
    get summarizationContent() {
      return summarizationContent
    },
    set summarizationContent(query) {
      summarizationContent = query
    },

    // UI Elements
    get metadataSidebarOpen() {
      return metadataSidebarOpen
    },
    get metadataSidebarData() {
      return metadataSidebarData
    },
    get metadataSidebarEditMode() {
      return metadataSidebarEditMode
    },
    get userSidebarOpen() {
      return userSidebarOpen
    },
    get quickAddOpen() {
      return quickAddOpen
    },
    set quickAddOpen(data) {
      quickAddOpen = data
    },
    toggleMetadataSidebar: (target?: boolean): boolean =>
      (metadataSidebarOpen = target ?? !metadataSidebarOpen),
    toggleMetadataSidebarEditMode: (target?: boolean): boolean =>
      (metadataSidebarEditMode = target ?? !metadataSidebarEditMode),
    setMetadataSidebarData: (data: MetadataSidebarData): MetadataSidebarData =>
      (metadataSidebarData = data),
    toggleUserSidebar: (): boolean => (userSidebarOpen = !userSidebarOpen),
    toggleQuickAdd: (target?: boolean): boolean => (quickAddOpen = target ?? !quickAddOpen),
  }
}
