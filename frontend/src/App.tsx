import { Routes, Route, Navigate, Outlet, useLocation, NavLink } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Favourites } from './pages/Favourites'
import { MealPlanner } from './pages/MealPlanner'
import { NutritionDashboard } from './pages/NutritionDashboard'
import { Profile } from './pages/Profile'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminReviews } from './pages/admin/AdminReviews'
import { useAuth } from './hooks/useAuth'
import { PageSpinner } from './components/ui/Spinner'

function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // isLoading is only true when there is NO cached user and getMe() is in
  // flight. If we have a cached user, isLoading is false immediately and
  // we render the protected page right away — no spinner flash.
  if (isLoading) return <PageSpinner />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

function AdminRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <PageSpinner />
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-500 hover:text-gray-900'}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* NavLink (not <a href>) keeps navigation inside React Router — no page reload */}
      <div className="mb-6 flex gap-4 border-b pb-3">
        <NavLink to="/admin"         end     className={linkClass}>Overview</NavLink>
        <NavLink to="/admin/users"           className={linkClass}>Users</NavLink>
        <NavLink to="/admin/reviews"         className={linkClass}>Reviews</NavLink>
      </div>
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/"       element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favourites"   element={<Favourites />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/nutrition"    element={<NutritionDashboard />} />
          <Route path="/profile"      element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route index              element={<AdminDashboard />} />
          <Route path="users"       element={<AdminUsers />} />
          <Route path="reviews"     element={<AdminReviews />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
