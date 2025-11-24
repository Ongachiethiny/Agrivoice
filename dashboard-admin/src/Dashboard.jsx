import React, { useState, useEffect } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats from backend
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/impact-stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">📊 AgriVoice Impact Dashboard</h1>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Diagnoses</p>
          <p className="text-3xl font-bold text-green-600">{stats?.total_diagnoses || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Farmers Helped</p>
          <p className="text-3xl font-bold text-blue-600">{stats?.total_farmers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Regions Active</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.regions || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Success Rate</p>
          <p className="text-3xl font-bold text-orange-600">{stats?.success_rate || 0}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Diagnoses by Disease Type</h2>
          {/* TODO: Add Recharts BarChart */}
          <p className="text-gray-500">Chart placeholder</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Diagnoses by Region</h2>
          {/* TODO: Add Recharts PieChart */}
          <p className="text-gray-500">Chart placeholder</p>
        </div>
      </div>
    </div>
  )
}
