
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import authService from '../services/authService'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }

    if (password.length < 8 || password.length > 72) {
      setError('Password must contain between 8 and 72 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const data = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      // Automatically sign in if registration returns a token and user.
      if (data?.token && data?.user) {
        login(data)
        navigate('/', { replace: true })
      } else {
        // Some APIs create the account without returning a login session.
        navigate('/login', {
          replace: true,
          state: { message: 'Account created. Please sign in.' },
        })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to create your account. Check the server connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
        <Link to="/login" className="mb-8 flex items-center gap-3 text-xl font-bold text-indigo-700">
          <span className="rounded-xl bg-indigo-50 p-2">
            <BrainCircuit size={28} />
          </span>
          CareerIntel
        </Link>

        <p className="text-sm font-semibold text-indigo-600">
          GET STARTED
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Start discovering career opportunities and building your learning roadmap.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <UserRound size={18} className="text-slate-400" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full bg-transparent py-3.5 text-sm outline-none"
              />
            </div>
          </div>

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
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
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

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
