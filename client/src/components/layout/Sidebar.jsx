
import { NavLink } from 'react-router-dom'
import {
  BrainCircuit,
  LayoutDashboard,
  FileSearch,
  BriefcaseBusiness,
  Map,
  History,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Resume Analyzer', icon: FileSearch },
  { to: '/careers', label: 'Career Matches', icon: BriefcaseBusiness },
  { to: '/roadmap', label: 'Learning Roadmap', icon: Map },
  { to: '/history', label: 'Analysis History', icon: History },
]

export default function Sidebar() {
  return (
    <aside className="bg-slate-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
      <NavLink to="/" className="mb-8 flex items-center gap-3 text-xl font-bold">
        <span className="rounded-xl bg-indigo-500 p-2">
          <BrainCircuit size={24} />
        </span>
        CareerIntel
      </NavLink>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Workspace
      </p>

      <nav className="flex flex-wrap gap-2 md:flex-col">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
