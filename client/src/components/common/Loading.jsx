
export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 p-8" role="status">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      <span className="text-sm text-slate-600">{message}</span>
    </div>
  )
}
