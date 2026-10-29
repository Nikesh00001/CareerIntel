
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="p-5 sm:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
