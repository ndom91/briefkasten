"use client"

import { useRef, useContext, useLayoutEffect } from "react"
import { produce } from "immer"
import { createStore, useStore as useZustandStore } from "zustand"
import { createContext } from "react"
import { mountStoreDevtool } from "simple-zustand-devtools"
import { viewTypes } from "@/lib/constants"

let store
let devtoolStoreMounted = false

const initialState = {
  bookmarks: [],
  categories: [],
  tags: [],
  categoryFilter: "",
  tagFilter: "",
  searchText: "",
  editBookmark: {},
  settings: {
    locale: "en-US",
    activeView: viewTypes.CARD.name,
    defaultView: viewTypes.CARD.name,
  },
}

const zustandContext = createContext()
export const ZustandProvider = zustandContext.Provider

export const StoreProvider = ({ children, ...props }) => {
  const storeRef = useRef()

  if (!storeRef.current) {
    storeRef.current = initializeStore(props)
  }

  return <ZustandProvider value={storeRef.current}>{children}</ZustandProvider>
}

/** @type {import('zustand/index').UseStore<typeof initialState>} */
// export const useStore = zustandContext.useStore

export const useStore = (selector) => {
  const store = useContext(zustandContext)

  if (!store) throw new Error("Store is missing the provider")

  return useZustandStore(store, selector)
}

export const initializeStore = (preloadedState = {}) => {
  let initialStore = (set, get) => ({
    ...initialState,
    ...preloadedState,

    // SEARCH
    setSearchText: (input) => set(() => ({ searchText: input })),
    clearSearchText: () => set(() => ({ searchText: initialState.searchText })),

    // SIDEBAR FILTER
    setCategoryFilter: (id) => set(() => ({ categoryFilter: id })),
    clearCategoryFilter: () => set(() => ({ categoryFilter: initialState.categoryFilter })),
    setTagFilter: (id) => set(() => ({ tagFilter: id })),
    clearTagFilter: () => set(() => ({ tagFilter: initialState.tagFilter })),

    // BOOKMARKS
    setBookmarks: (bookmarks) => set(() => ({ bookmarks })),
    addBookmark: (payload) =>
      set(
        produce((draft) => {
          draft.bookmarks.unshift(payload)
        }),
      ),
    removeBookmark: (payload) =>
      set(
        produce((draft) => {
          const bookmarkIndex = draft.bookmarks.findIndex((b) => b.id === payload)
          draft.bookmarks.splice(bookmarkIndex, 1)
        }),
      ),
    updateBookmark: (payload) =>
      set(
        produce((draft) => {
          const updateIndex = draft.bookmarks.findIndex((bm) => bm.id === payload.id)
          draft.bookmarks[updateIndex] = {
            ...draft.bookmarks[updateIndex],
            ...payload,
          }
        }),
      ),
    resetBookmarks: () => set({ bookmarks: initialState.bookmarks }),

    // TAGS
    setTags: (tags) => set(() => ({ tags })),
    addTag: (payload) => set(produce((draft) => draft.tags.unshift(payload))),
    updateTag: (id, { name, emoji }) => {
      set(
        produce((draft) => {
          const updateIndex = draft.tags.findIndex((t) => t.id === id)
          draft.tags[updateIndex] = {
            ...draft.tags[updateIndex],
            name,
            emoji,
          }
        }),
      )
    },
    removeTag: (payload) =>
      set(
        produce((draft) => {
          const tagIndex = draft.tags.findIndex((t) => t.id === payload)
          draft.tags.splice(tagIndex, 1)
        }),
      ),
    resetTags: () => set({ tags: initialState.tags }),

    // CATEGORIES
    setCategories: (categories) => set(() => ({ categories })),
    addCategory: (payload) =>
      set(
        produce((draft) => {
          draft.categories.unshift(payload)
        }),
      ),
    updateCategory: (id, { name, description }) => {
      set(
        produce((draft) => {
          const updateIndex = draft.categories.findIndex((c) => c.id === id)
          draft.categories[updateIndex] = {
            ...draft.categories[updateIndex],
            name,
            description,
          }
        }),
      )
    },
    removeCategory: (payload) =>
      set(
        produce((draft) => {
          const categoryIndex = draft.categories.findIndex((c) => c.id === payload)
          draft.categories.splice(categoryIndex, 1)
        }),
      ),
    resetCategories: () => set({ categories: initialState.categories }),

    // USER SETTINGS
    setUserSetting: (setting) => {
      set(() => {
        return { settings: { ...get().settings, ...setting } }
      })
    },

    // SLIDEOUT - ACTIVE EDIT BOOKMARK
    setEditBookmark: (payload) => {
      set(
        produce((draft) => {
          draft.editBookmark = payload
        }),
      )
    },
  })

  return createStore(initialStore)
}

export function useCreateStore(initialState) {
  // For SSR & SSG, always use a new store.
  if (typeof window === "undefined") {
    return () => initializeStore(initialState)
  }

  if (process.env.NODE_ENV === "development" && store && !devtoolStoreMounted) {
    mountStoreDevtool("Briefkasten_Store", store)
    devtoolStoreMounted = true
  }

  // For CSR, always re-use same store.
  store = store || initializeStore(initialState)
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      store.setState({
        ...store.getState(),
        ...initialState,
      })
    }
  }, [initialState])

  return () => store
}
