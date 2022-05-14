export default function Chip({ children = 'Tech' }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full p-2">
      <div className="mr-2">{children}</div>
    </div>
  )
}
