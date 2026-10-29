
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSearch, Sparkles, UploadCloud, FileText, X } from 'lucide-react'
import analysisService from '../services/analysisService'
import api from '../services/api'
import ErrorMessage from '../components/common/ErrorMessage'
import CareerCard from '../components/dashboard/CareerCard'
import RoadmapStep from '../components/roadmap/RoadmapStep'

export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

    const navigate = useNavigate()

    function handleFileChange(event) {
        const file = event.target.files?.[0]

        setError('')
        setResult(null)

        if (!file) {
            setResumeFile(null)
            return
        }

        const allowedExtensions = ['pdf', 'docx']
        const extension = file.name.split('.').pop()?.toLowerCase()

        if (!allowedExtensions.includes(extension)) {
            setResumeFile(null)
            event.target.value = ''
            setError('Please select a PDF or DOCX file.')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setResumeFile(null)
            event.target.value = ''
            setError('File size must be 5 MB or less.')
            return
        }

        setResumeFile(file)
    }

    async function handleAnalyze(event) {
        event.preventDefault()
        setError('')
        setResult(null)

        if (!resumeFile && resumeText.trim().length < 30) {
            setError('Upload a resume file or enter at least 30 characters of resume text.')
            return
        }

        setLoading(true)

        try {
            let data

            if (resumeFile) {
                const formData = new FormData()
                formData.append('file', resumeFile)

                console.log('File:', resumeFile.name)
                console.log('FormData keys:', [...formData.keys()])

                const response = await api.post('/analyses/upload', formData)
                data = response.data
            } else {
                data = await analysisService.analyzeResume(resumeText.trim())
            }

            setResult(data?.analysis || data?.result || data)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                'Resume analysis failed. Check that Express, MongoDB, and FastAPI are running and that the upload endpoint exists.'
            )
        } finally {
            setLoading(false)
        }
    }

    const skills =
        result?.extracted_skills ||
        result?.extractedSkills ||
        []

    const careers =
        result?.career_recommendations ||
        result?.careerRecommendations ||
        []

    const roadmapData =
        result?.suggested_learning_roadmap ||
        result?.roadmap

    const roadmapSteps = Array.isArray(roadmapData)
        ? roadmapData
        : roadmapData?.steps || []

    return (
        <div className="space-y-8">
            <section>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                    <Sparkles size={16} />
                    AI career intelligence
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Resume analyzer
                </h1>

                <p className="mt-2 text-slate-500">
                    Upload your resume or paste its text to discover your skills,
                    suitable careers, and personalized learning roadmap.
                </p>
            </section>

            <form
                onSubmit={handleAnalyze}
                className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
                {/* File upload */}
                <section>
                    <h2 className="mb-3 font-semibold text-slate-800">
                        Upload your resume
                    </h2>

                    <label
                        htmlFor="resumeFile"
                        className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-7 text-center transition hover:border-indigo-500 hover:bg-indigo-50"
                    >
                        <UploadCloud size={36} className="mb-3 text-indigo-600" />

                        <span className="font-semibold text-slate-800">
                            Choose a resume file
                        </span>

                        <span className="mt-1 text-sm text-slate-500">
                            PDF or DOCX · Maximum 5 MB
                        </span>

                        <span className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                            Browse files
                        </span>

                        <input
                            id="resumeFile"
                            type="file"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            disabled={loading}
                            className="sr-only"
                        />
                    </label>

                    {resumeFile && (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <FileText size={20} className="shrink-0 text-emerald-700" />

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-emerald-800">
                                        {resumeFile.name}
                                    </p>

                                    <p className="text-xs text-emerald-700">
                                        {(resumeFile.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => {
                                    setResumeFile(null)
                                    const input = document.getElementById('resumeFile')
                                    if (input) input.value = ''
                                }}
                                className="rounded-lg p-2 text-slate-500 hover:bg-white disabled:opacity-50"
                                aria-label="Remove selected resume"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </section>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium uppercase text-slate-400">
                        Or paste text
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Manual text input */}
                <section>
                    <label
                        htmlFor="resumeText"
                        className="mb-3 block font-semibold text-slate-800"
                    >
                        Paste your resume text
                    </label>

                    <textarea
                        id="resumeText"
                        value={resumeText}
                        onChange={(event) => setResumeText(event.target.value)}
                        placeholder="Add your education, skills, projects, work experience, and interests..."
                        rows={9}
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-300 p-4 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                        {resumeText.trim().length} characters
                    </p>
                </section>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        (!resumeFile && resumeText.trim().length < 30)
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    <FileSearch size={18} />
                    {loading ? 'Analyzing resume...' : 'Analyze resume'}
                </button>

                {loading && (
                    <p className="text-sm text-slate-500">
                        Processing your resume. Please wait...
                    </p>
                )}
            </form>

            {error && <ErrorMessage message={error} />}

            {result && (
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900">
                            Extracted skills
                        </h2>

                        {skills.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {skills.map((skill, index) => {
                                    const skillName =
                                        typeof skill === 'string'
                                            ? skill
                                            : skill?.name || skill?.skill || JSON.stringify(skill)

                                    return (
                                        <span
                                            key={`${skillName}-${index}`}
                                            className="rounded-full bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
                                        >
                                            {skillName}
                                        </span>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-slate-500">
                                No skills were returned by the service.
                            </p>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900">
                            Career recommendations
                        </h2>

                        {careers.length > 0 ? (
                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                {careers.map((career, index) => (
                                    <CareerCard
                                        key={career.occupation_code || career.title || index}
                                        career={career}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-slate-500">
                                No career recommendations were returned.
                            </p>
                        )}
                    </section>

                    {roadmapSteps.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">
                                Suggested learning roadmap
                            </h2>

                            <div className="mt-4 space-y-3">
                                {roadmapSteps.map((step, index) => (
                                    <RoadmapStep
                                        key={step.id || step.step || index}
                                        step={step}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate('/careers')}
                        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white"
                    >
                        View career matches
                    </button>
                </div>
            )}
        </div>
    )
}
