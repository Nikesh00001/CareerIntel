
import { Navigate, Route, Routes } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import ResumeAnalyzer from '../pages/ResumeAnalyzer'
import CareerMatches from '../pages/CareerMatches'
import LearningRoadmap from '../pages/LearningRoadmap'
import AnalysisHistory from '../pages/AnalysisHistory'
import NotFound from '../pages/NotFound'

import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<ResumeAnalyzer />} />
          <Route path="/careers" element={<CareerMatches />} />
          <Route path="/roadmap" element={<LearningRoadmap />} />
          <Route path="/history" element={<AnalysisHistory />} />
        </Route>
      </Route>

      <Route
        path="/home"
        element={<Navigate to="/" replace />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
