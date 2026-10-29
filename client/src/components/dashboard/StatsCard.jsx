
import { TrendingUp } from 'lucide-react'

export default function StatsCard({ title, value = 0, description, icon: Icon = TrendingUp }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          {description && (
            <p className="mt-2 text-xs text-slate-500">{description}</p>
          )}
        </div>

        <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={22} />
        </span>
      </div>
    </article>
  )
}
