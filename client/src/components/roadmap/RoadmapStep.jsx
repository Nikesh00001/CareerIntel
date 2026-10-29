
import { CheckCircle2, Circle, Clock3 } from 'lucide-react'

export default function RoadmapStep({ step, onStatusChange, disabled = false }) {
  const title = step?.skill || step?.title || step?.name || 'Learning step'
  const description = step?.description || step?.practical_task || ''
  const hours = step?.estimated_hours ?? step?.hours
  const status = step?.status || 'not_started'
  const completed = status === 'completed'

  return (
    <article className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span className={completed ? 'mt-0.5 text-emerald-600' : 'mt-0.5 text-slate-400'}>
        {completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {hours != null && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock3 size={14} /> {hours} hours
            </span>
          )}
        </div>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        )}

        {step?.resource_url && (
          <a
            href={step.resource_url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Learning resource
          </a>
        )}

        {onStatusChange && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onStatusChange(
              step._id || step.id || step.step,
              completed ? 'not_started' : 'completed'
            )}
            className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {completed ? 'Mark as not started' : 'Mark completed'}
          </button>
        )}
      </div>
    </article>
  )
}
