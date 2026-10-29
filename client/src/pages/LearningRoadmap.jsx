
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import roadmapService from '../services/roadmapService'
import RoadmapStep from '../components/roadmap/RoadmapStep'
import Loading from '../components/common/Loading'
import ErrorMessage from '../components/common/ErrorMessage'

export default function LearningRoadmap() {
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadRoadmap = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await roadmapService.getRoadmap()
      setRoadmap(data?.roadmap || data?.data || data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load the saved roadmap.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoadmap()
  }, [loadRoadmap])

  async function handleStatusChange(stepId, status) {
    if (stepId == null) {
      setError('This step has no saved ID, so its progress cannot be updated yet.')
      return
    }

    setUpdatingId(stepId)
    setError('')

    try {
      await roadmapService.updateStep(stepId, status)
      await loadRoadmap()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update roadmap progress.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) return <Loading message="Loading your learning roadmap..." />

  const steps = Array.isArray(roadmap?.steps) ? roadmap.steps : []
  const completed = steps.filter((step) => step.status === 'completed').length
  const progress = steps.length ? Math.round((completed / steps.length) * 100) : 0

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold text-slate-900">Learning roadmap</h1>
        <p className="mt-2 text-slate-500">
          Follow your learning steps and track your progress.
        </p>
      </section>

      {error && <ErrorMessage message={error} onRetry={loadRoadmap} />}

      {!error && steps.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No roadmap found</h2>
          <p className="mt-2 text-sm text-slate-500">
            Analyze a resume first to generate a suggested learning roadmap.
          </p>
          <Link to="/analyze" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">
            Analyze resume
          </Link>
        </div>
      )}

      {steps.length > 0 && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">
                {roadmap?.title || 'Your personalized roadmap'}
              </h2>
              <span className="text-sm font-semibold text-indigo-700">
                {completed}/{steps.length} completed
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-right text-xs text-slate-500">{progress}% complete</p>
          </section>

          <section className="space-y-3">
            {steps.map((step, index) => {
              const id = step._id || step.id || step.step
              return (
                <RoadmapStep
                  key={id || index}
                  step={step}
                  disabled={updatingId === id}
                  onStatusChange={handleStatusChange}
                />
              )
            })}
          </section>
        </>
      )}
    </div>
  )
}
