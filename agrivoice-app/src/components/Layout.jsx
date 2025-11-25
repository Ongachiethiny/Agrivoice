import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authService } from '@/services/auth'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Load user from local storage
    const storedUser = authService.getUser()
    setUser(storedUser)
  }, [])

  const isActive = (path) => location.pathname === path ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setShowMenu(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-bold text-green-700">AgriVoice</span>
            </Link>

            <div className="hidden md:flex space-x-8 items-center">
              <Link to="/" className={`font-semibold transition ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/diagnose" className={`font-semibold transition ${isActive('/diagnose')}`}>
                🌾 Diagnose
              </Link>
              <Link to="/dashboard" className={`font-semibold transition ${isActive('/dashboard')}`}>
                📊 Analytics
              </Link>
              {user && (
                <Link to="/history" className={`font-semibold transition ${isActive('/history')}`}>
                  📋 History
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
                  >
                    <span>👤</span>
                    <span className="text-sm">{user.full_name}</span>
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <Link
                        to="#profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
                      >
                        👤 Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-green-600 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex space-x-4 items-center">
              <Link to="/diagnose" className={`font-semibold text-sm ${isActive('/diagnose')}`}>
                Diagnose
              </Link>
              <Link to="/dashboard" className={`font-semibold text-sm ${isActive('/dashboard')}`}>
                Analytics
              </Link>
              {user && (
                <Link to="/history" className={`font-semibold text-sm ${isActive('/history')}`}>
                  History
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 font-semibold"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="text-sm text-green-600 font-semibold">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-2">🌾 AgriVoice</h3>
              <p className="text-gray-400">AI-powered crop diagnosis for African farmers</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/diagnose" className="hover:text-white">Diagnose Crop</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">View Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <p className="text-gray-400">Backend API:<br />
                <span className="text-xs">https://agrivoice-backend-aefdd2d38be7.herokuapp.com</span>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgriVoice. Empowering farmers with AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
