import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'

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

            <div className="hidden md:flex space-x-8">
              <Link to="/" className={`font-semibold transition ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/diagnose" className={`font-semibold transition ${isActive('/diagnose')}`}>
                🌾 Diagnose
              </Link>
              <Link to="/dashboard" className={`font-semibold transition ${isActive('/dashboard')}`}>
                📊 Analytics
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex space-x-4">
              <Link to="/diagnose" className={`font-semibold text-sm ${isActive('/diagnose')}`}>
                Diagnose
              </Link>
              <Link to="/dashboard" className={`font-semibold text-sm ${isActive('/dashboard')}`}>
                Analytics
              </Link>
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
