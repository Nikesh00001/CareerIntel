
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CareerCard from '../components/dashboard/CareerCard'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'
import analysisService from '../services/analysisService'

export default function CareerMatches() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    analysisService.getHistory()
      .then((data) => {
        const history = Array.isArray(data)
          ? data
          : data?.analyses || data?.data || []

        const latest = history[0]
        const recommendations =
          latest?.career_recommendations || latest?.careerRecommendations || []

        if (active) setCareers(recommendations)
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || 'Could not load career matches.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  if (loading) return <Loading message="Loading career matches..." />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Career matches</h1>
        <p className="mt-2 text-slate-500">
          Explore careers suggested by your latest resume analysis.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && careers.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No career matches yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Analyze your resume first to generate recommendations.
          </p>
          <Link to="/analyze" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
            Analyze resume
          </Link>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {careers.map((career, index) => (
          <CareerCard key={career.occupation_code || career.title || index} career={career} />
        ))}
      </div>
    </div>
  )
}
