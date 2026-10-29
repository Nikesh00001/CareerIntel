
import { Link } from 'react-router-dom'
import { ArrowRight, FileText } from 'lucide-react'

export default function RecentAnalyses({ analyses = [] }) {
  const items = Array.isArray(analyses) ? analyses : []

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-900">Recent analyses</h2>
        <Link
          to="/history"
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={15} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center">
          <FileText className="mx-auto text-slate-400" size={32} />
          <p className="mt-3 font-medium text-slate-700">No analyses yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Analyze your resume to see your results here.
          </p>
          <Link
            to="/analyze"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Analyze resume
          </Link>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-slate-100">
          {items.slice(0, 5).map((item, index) => {
            const id = item._id || item.id
            const date = item.createdAt || item.created_at

            return (
              <div key={id || index} className="flex items-center gap-3 py-4">
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <FileText size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    Resume analysis {index + 1}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {date ? new Date(date).toLocaleDateString() : 'Date unavailable'}
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {(item.extracted_skills || item.extractedSkills || []).length} skills
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
