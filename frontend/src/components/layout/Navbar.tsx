import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-600">
          🍳 RecipeAI
        </Link>

        <div className="flex items-center gap-4 ml-4">
          <NavLink to="/"           className={linkClass} end>Discover</NavLink>
          {user && <NavLink to="/favourites"   className={linkClass}>Favourites</NavLink>}
          {user && <NavLink to="/meal-planner" className={linkClass}>Meal Planner</NavLink>}
          {user && <NavLink to="/nutrition"    className={linkClass}>Nutrition</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
