
import { LogOut, UserRound } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  const displayName = user?.name || user?.email || 'Student'

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Career Intelligence
        </p>
        <h2 className="mt-1 font-semibold text-slate-900">
          Welcome, {displayName}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
          <UserRound size={20} />
        </span>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  )
}
