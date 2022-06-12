export default function Chip({ name, color, remove, id }) {
  return (
    <div
      className={`flex items-center justify-center space-x-1 rounded-full py-1 px-3 ${
        color ? `bg-[${color}]` : 'bg-slate-200'
      }`}
    >
      <div className="text-xs text-slate-600">{name}</div>
      {remove && (
        <button
          onClick={() => remove(id)}
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-slate-800/20"
        >
          <svg
            className="mb-0.5 h-3 w-3 text-slate-500"
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
        </button>
      )}
    </div>
  )
}
