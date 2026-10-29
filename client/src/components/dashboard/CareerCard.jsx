
import { BriefcaseBusiness, CheckCircle2, Target } from 'lucide-react'

export default function CareerCard({ career }) {
  const title =
    career?.title ||
    career?.career ||
    career?.occupation ||
    career?.name ||
    'Career option'

  const score =
    career?.ranking_score ??
    career?.weighted_match_percent ??
    career?.match_score ??
    career?.score

  const matchedSkills =
    career?.matched_skills ||
    career?.matchedSkills ||
    []

  const missingSkills =
    career?.missing_skills ||
    career?.missingSkills ||
    []
    

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BriefcaseBusiness size={22} />
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-xs text-slate-500">
              Career recommendation
            </p>
          </div>
        </div>

        {score !== undefined && score !== null && (
          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-700">
            {Number(score).toFixed(1)}%
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <CheckCircle2 size={14} /> Matched
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {matchedSkills.length}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Target size={14} /> Skill gaps
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {missingSkills.length}
          </p>
        </div>
      </div>

      {matchedSkills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {matchedSkills.slice(0, 5).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700"
            >
              {typeof skill === 'string' ? skill : skill?.name || skill?.skill}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
