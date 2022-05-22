import { useLayoutEffect } from 'react'
import create from 'zustand'
import createContext from 'zustand/context'

let store

const initialState = {
  bookmarks: [],
  categories: [],
  tags: [],
  categoryFilter: '',
  tagFilter: '',
  searchText: '',
}

const zustandContext = createContext()
export const ZustandProvider = zustandContext.Provider
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const useStore = zustandContext.useStore

export const initializeStore = (preloadedState = {}) => {
  return create((set, get) => ({
    ...initialState,
    ...preloadedState,
    setSearchText: (input) => set(() => ({ searchText: input })),
    clearSearchText: () => set(() => ({ searchText: initialState.searchText })),
    setCategoryFilter: (id) => set(() => ({ categoryFilter: id })),
    clearCategoryFilter: () =>
      set(() => ({ categoryFilter: initialState.categoryFilter })),
    setTagFilter: (id) => set(() => ({ tagFilter: id })),
    clearTagFilter: () => set(() => ({ tagFilter: initialState.tagFilter })),
    setBookmarks: (bookmarks) => set(() => ({ bookmarks })),
    addBookmark: (bookmark) =>
      set(() => ({ bookmarks: [...get().bookmarks, bookmark] })),
    removeBookmark: (bookmark) =>
      set(() => ({
        bookmarks: [...get().bookmarks.filter((bm) => bm.id !== bookmark.id)],
      })),
    resetBookmarks: () => set({ bookmarks: initialState.bookmarks }),

    setTags: (tags) => set(() => ({ tags })),
    addTag: (tag) => set(() => ({ tags: [...get().tags, tag] })),
    updateTag: (id, tag) => {
      const { name, emoji } = tag
      const newTag = get().tags.find((t) => t.id === id)
      newTag.name = name
      newTag.emoji = emoji
      set(() => ({
        tags: [...get().tags.filter((t) => t.id !== id), newTag],
      }))
    },
    removeTag: (tag) =>
      set(() => ({
        tags: [...get().tags.filter((t) => t.id !== tag.id)],
      })),
    resetTags: () => set({ tags: initialState.tags }),

    setCategories: (categories) => set(() => ({ categories })),
    addCategory: (category) =>
      set(() => ({ categories: [...get().categories, category] })),
    updateCategory: (id, category) => {
      const { name, description } = category
      const cat = get().categories.find((cat) => cat.id === id)
      cat.name = name
      cat.description = description
      set(() => ({
        categories: [...get().categories.filter((cat) => cat.id !== id), cat],
      }))
    },
    removeCategory: (category) =>
      set(() => ({
        categories: [
          ...get().categories.filter((cat) => cat.id !== category.id),
        ],
      })),
    resetCategories: () => set({ categories: initialState.categories }),
  }))
}

export function useCreateStore(initialState) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(initialState)
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState)
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
