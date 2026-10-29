
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
        CareerIntel
      </p>
      <h1 className="mt-4 text-7xl font-bold text-slate-900">404</h1>
      <p className="mt-4 text-slate-600">We couldn't find that page.</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
      >
        Back to dashboard
      </Link>
    </main>
  )
}
