import { useEffect, useRef, useState } from 'react'
import { useKeyPress, useLocalStorage } from 'react-use'
import { viewTypes } from '@/lib/constants'
import { useStore } from '@/lib/store'
import Breadcrumbs from '@/components/breadcrumbs'

export default function DashboardHeader() {
  const setUserSetting = useStore((state) => state.setUserSetting)
  const settings = useStore((state) => state.settings)

  const searchText = useStore((state) => state.searchText)
  const setSearchText = useStore((state) => state.setSearchText)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef()
  const [value, setValue, remove] = useLocalStorage(
    'dashboard.activeView',
    settings.currentView
  )

  useEffect(() => {
    if (value) {
      setUserSetting({ activeView: value })
    }
  }, [])

  useKeyPress((e) => {
    if (e.type === 'keydown') {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        searchRef?.current?.focus()
      }
    }
  })

  const updateActiveView = (newView) => {
    setValue(newView)
    setUserSetting({ activeView: newView })
  }

  return (
    <div className="flex w-full items-center justify-between p-4 md:p-6">
      <Breadcrumbs />
      <div className="relative flex w-2/3 items-center justify-start pl-0 pr-2 md:px-4">
        <svg
          className="pointer-events-none absolute left-2 top-2 h-5 w-5 text-slate-200 md:left-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {!searchFocused && searchText.length === 0 ? (
          <div className="pointer-events-none absolute left-14 top-[0.48rem] z-10 hidden text-sm text-slate-400 opacity-50 lg:inline-block">
            <span className="rounded-md bg-slate-200 p-1 px-2 text-xs">
              <kbd className="">ctrl</kbd>
              <span> + </span>
              <kbd className="">k</kbd>
            </span>
            <span> to search</span>
          </div>
        ) : null}
        <input
          ref={searchRef}
          type="text"
          value={searchText}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full rounded-md border-2 border-slate-200 py-1 px-2 pl-8 pr-8 text-base text-slate-600 outline-none placeholder:text-slate-200 focus:border-slate-500 focus:ring-2 focus:ring-white"
        />
        {searchText.length ? (
          <svg
            className="absolute right-4 top-1.5 h-6 w-6 text-rose-300 hover:cursor-pointer md:right-6"
            onClick={() => setSearchText('')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : null}
      </div>
      <div className="flex">
        <button
          type="button"
          aria-label="Card View"
          onClick={() => updateActiveView(viewTypes.CARD.name)}
          className={`inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded-l-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
            settings.activeView === viewTypes.CARD.name &&
            '!bg-slate-800 !text-white hover:!bg-slate-900'
          }`}
        >
          <svg
            className="h-5 w-5 shrink-0 font-semibold "
            viewBox="0 0 256 256"
            dangerouslySetInnerHTML={{ __html: viewTypes.CARD.icon }}
          />
        </button>
        <button
          type="button"
          aria-label="List View"
          onClick={() => updateActiveView(viewTypes.LIST.name)}
          className={`inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded-r-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 md:rounded-none ${
            settings.activeView === viewTypes.LIST.name &&
            '!bg-slate-800 !text-white hover:!bg-slate-900'
          } `}
        >
          <svg
            className="h-5 w-5 shrink-0 font-semibold"
            viewBox="0 0 256 256"
            dangerouslySetInnerHTML={{ __html: viewTypes.LIST.icon }}
          />
        </button>
        <button
          type="button"
          aria-label="Detail View"
          disabled={true}
          onClick={() => updateActiveView(viewTypes.DETAIL.name)}
          className={`hidden w-auto cursor-pointer select-none appearance-none items-center justify-center rounded-r-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:cursor-not-allowed hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 md:inline-flex ${
            settings.activeView === viewTypes.DETAIL.name &&
            '!bg-slate-800 !text-white hover:!bg-slate-900'
          } `}
        >
          <svg
            className="h-5 w-5 shrink-0 font-semibold"
            viewBox="0 0 256 256"
            dangerouslySetInnerHTML={{ __html: viewTypes.DETAIL.icon }}
          />
        </button>
      </div>
    </div>
  )
}
