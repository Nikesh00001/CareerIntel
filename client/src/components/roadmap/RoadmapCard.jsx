
import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RoadmapCard({ roadmap }) {
  const steps = Array.isArray(roadmap?.steps) ? roadmap.steps : []
  const completed = steps.filter((step) => step.status === 'completed').length
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <BookOpen size={22} />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">
            {roadmap?.title || 'Your learning roadmap'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {completed} of {steps.length} steps completed
          </p>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-right text-xs text-slate-500">{percent}% complete</p>

      <Link
        to="/roadmap"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        Open roadmap <ArrowRight size={16} />
      </Link>
    </section>
  )
}
