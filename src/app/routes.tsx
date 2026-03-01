import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { HomePage } from '../pages/HomePage'
import { WorkoutsPage } from '../pages/WorkoutsPage'
import { MilestonesPage } from '../pages/MilestonesPage'
import { RewardsPage } from '../pages/RewardsPage'
import { SettingsPage } from '../pages/SettingsPage'

export function AppRoutes() {
  return (
    <BrowserRouter basename="/RewardFit">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}
