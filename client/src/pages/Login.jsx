
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BrainCircuit, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import authService from '../services/authService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    try {
      const data = await authService.login({
        email: email.trim(),
        password,
      })

      login(data)

      const destination = location.state?.from?.pathname || '/'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to log in. Check your credentials and backend connection.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-950 p-10 text-white md:flex">
          <Link to="/login" className="flex items-center gap-3 font-bold text-xl">
            <span className="rounded-xl bg-white/15 p-2">
              <BrainCircuit size={28} />
            </span>
            CareerIntel
          </Link>

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Your career. Your future.
            </p>
            <h1 className="text-4xl font-bold leading-tight">
              Turn your skills into your next opportunity.
            </h1>
            <p className="mt-5 leading-7 text-indigo-100">
              Analyze your resume, discover career paths, and build a
              personalized learning roadmap.
            </p>
          </div>

          <p className="text-sm text-indigo-200">
            AI-powered career intelligence platform
          </p>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-700">
              <BrainCircuit size={28} />
              CareerIntel
            </div>
          </div>

          <p className="text-sm font-semibold text-indigo-600">
            WELCOME BACK
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Continue your career development journey.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <Mail size={18} className="text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create account
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
