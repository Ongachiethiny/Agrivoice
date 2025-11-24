import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            🌾 AgriVoice
          </Link>
          <nav className="flex gap-4">
            <Link to="/" className="hover:bg-green-600 px-3 py-2 rounded">Home</Link>
            <Link to="/diagnose" className="hover:bg-green-600 px-3 py-2 rounded">Diagnose</Link>
            <Link to="/profile" className="hover:bg-green-600 px-3 py-2 rounded">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white p-4 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">
            AgriVoice © 2024 - Sustainable Crop Health for African Farmers
          </p>
        </div>
      </footer>
    </div>
  )
}
