
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, FileText } from 'lucide-react'
import analysisService from '../services/analysisService'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await analysisService.getHistory()
      setAnalyses(
        Array.isArray(data) ? data : data?.analyses || data?.data || []
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load analysis history.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  if (loading) return <Loading message="Loading analysis history..." />

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analysis history</h1>
          <p className="mt-2 text-slate-500">
            Review your previously saved resume analyses.
          </p>
        </div>
        <Link to="/analyze" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          New analysis
        </Link>
      </section>

      {error && <ErrorMessage message={error} onRetry={loadHistory} />}

      {!error && analyses.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <FileText className="mx-auto text-slate-400" size={34} />
          <h2 className="mt-4 font-semibold text-slate-900">No saved analyses</h2>
          <p className="mt-2 text-sm text-slate-500">
            Your analysis results will appear here after you analyze a resume.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {analyses.map((item, index) => {
          const id = item._id || item.id
          const skills = item.extracted_skills || item.extractedSkills || []
          const careers = item.career_recommendations || item.careerRecommendations || []
          const createdAt = item.createdAt || item.created_at

          return (
            <article key={id || index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                  <FileText size={22} />
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-900">
                    Resume analysis {analyses.length - index}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    {createdAt ? new Date(createdAt).toLocaleString() : 'Date unavailable'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {skills.length} skills
                    </span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700">
                      {careers.length} career matches
                    </span>
                  </div>

                  {skills.length > 0 && (
                    <p className="mt-3 text-sm text-slate-600">
                      Skills: {skills.slice(0, 8).map((skill) =>
                        typeof skill === 'string' ? skill : skill?.name || skill?.skill
                      ).filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
