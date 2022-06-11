import { viewTypes } from '@/lib/constants'
import { useStore } from '@/lib/store'
import Breadcrumbs from '@/components/breadcrumbs'

export default function DashboardHeader() {
  const setUserSetting = useStore((state) => state.setUserSetting)
  const settings = useStore((state) => state.settings)

  return (
    <div className="w-full px-4 py-6 flex justify-between items-center">
      <Breadcrumbs />
      <div className="flex ">
        <button
          type="button"
          aria-label="Card View"
          onClick={() =>
            setUserSetting({ ...settings, activeView: viewTypes.CARD.name })
          }
          className={`inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded-l border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
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
          onClick={() =>
            setUserSetting({ ...settings, activeView: viewTypes.LIST.name })
          }
          className={`inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
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
          onClick={() =>
            setUserSetting({ ...settings, activeView: viewTypes.DETAIL.name })
          }
          className={`inline-flex w-auto cursor-pointer select-none appearance-none items-center justify-center rounded-r border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 ${
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
