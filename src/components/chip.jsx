export default function Chip({ name, color }) {
  return (
    <div
      className={`inline-grid place-items-center rounded-full py-1 px-3 ${
        color ? `bg-[${color}]` : 'bg-slate-200'
      }`}
    >
      <div className="text-xs text-slate-600">{name}</div>
    </div>
  )
}
