
import { useCallback, useEffect, useState } from 'react'
import { BriefcaseBusiness, FileText, Target } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import RecentAnalyses from '../components/dashboard/RecentAnalyses'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'
import analysisService from '../services/analysisService'

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalyses = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await analysisService.getHistory()
      const list = Array.isArray(data)
        ? data
        : data?.analyses || data?.data || []

      setAnalyses(list)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAnalyses()
  }, [loadAnalyses])

  const skillCount = new Set(
    analyses.flatMap((item) =>
      (item.extracted_skills || item.extractedSkills || [])
        .map((skill) => typeof skill === 'string' ? skill : skill?.name || skill?.skill)
        .filter(Boolean)
    )
  ).size

  const careerCount = analyses.reduce(
    (total, item) =>
      total + (item.career_recommendations || item.careerRecommendations || []).length,
    0
  )

  if (loading) return <Loading message="Loading your dashboard..." />

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          Your workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Career dashboard
        </h1>
        <p className="mt-2 text-slate-500">
          Understand your skills and plan your next career move.
        </p>
      </section>

      {error && <ErrorMessage message={error} onRetry={loadAnalyses} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="Resume analyses" value={analyses.length} icon={FileText} description="Saved analyses" />
        <StatsCard title="Unique skills found" value={skillCount} icon={Target} description="Across your analyses" />
        <StatsCard title="Career matches" value={careerCount} icon={BriefcaseBusiness} description="Recommendations returned" />
      </section>

      <RecentAnalyses analyses={analyses} />
    </div>
  )
}
