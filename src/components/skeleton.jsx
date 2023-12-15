export default function Skeleton() {
  return (
    <div className="m-8 flex h-96 w-60 animate-pulse flex-col rounded shadow-md sm:w-80">
      <div className="h-48 rounded-t dark:bg-gray-700" />
      <div className="flex-1 space-y-4 px-4 py-8 dark:bg-gray-900 sm:p-8">
        <div className="h-6 w-full rounded dark:bg-gray-700" />
        <div className="h-6 w-full rounded dark:bg-gray-700" />
        <div className="h-6 w-3/4 rounded dark:bg-gray-700" />
      </div>
    </div>
  )
}
