import React, { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://agrivoice-backend-aefdd2d38be7.herokuapp.com'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [diseases, setDiseases] = useState([])
  const [impact, setImpact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchAllData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      setError(null)
      const [summaryRes, diseasesRes, impactRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics/summary`),
        fetch(`${API_URL}/api/analytics/diseases`),
        fetch(`${API_URL}/api/analytics/impact`),
      ])

      if (!summaryRes.ok || !diseasesRes.ok || !impactRes.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const summaryData = await summaryRes.json()
      const diseasesData = await diseasesRes.json()
      const impactData = await impactRes.json()

      setSummary(summaryData.data)
      setDiseases(diseasesData.data || [])
      setImpact(impactData.data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <p className="text-2xl font-bold text-gray-700">Loading AgriVoice Dashboard...</p>
          <p className="text-gray-500 mt-2">Connecting to backend...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-green-700">
                🌾 AgriVoice Impact Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Real-time crop health monitoring for African farmers
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated:</p>
              <p className="font-semibold text-gray-700">
                {lastUpdated.toLocaleTimeString()}
              </p>
              <button
                onClick={fetchAllData}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
              >
                🔄 Refresh Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p className="font-bold">⚠️ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Diagnoses"
            value={summary?.total_diagnoses || 0}
            icon="🔍"
            color="green"
          />
          <MetricCard
            title="Farmers Helped"
            value={impact?.farmers_helped || 0}
            icon="👨‍🌾"
            color="blue"
          />
          <MetricCard
            title="Crops Diagnosed"
            value={impact?.crop_count || 0}
            icon="🌾"
            color="yellow"
          />
          <MetricCard
            title="Crisis Severity"
            value={impact?.overall_crisis_severity?.toUpperCase() || 'LOW'}
            icon="⚠️"
            color={
              impact?.overall_crisis_severity === 'high'
                ? 'red'
                : impact?.overall_crisis_severity === 'moderate'
                  ? 'orange'
                  : 'green'
            }
          />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Summary Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Summary Statistics</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Average Severity:</span>
                <span className="font-bold text-lg text-orange-600">
                  {summary?.avg_severity || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Languages Used:</span>
                <span className="font-bold text-lg text-blue-600">
                  {summary?.languages_used?.length || 0}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Affected Regions:</span>
                <span className="font-bold text-lg text-purple-600">
                  {summary?.regions?.length || 0}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-700">Severe Cases:</span>
                <span className="font-bold text-lg text-red-600">
                  {impact?.severe_cases_percentage?.toFixed(1) || 0}%
                </span>
              </div>
            </div>

            {/* Languages */}
            {summary?.languages_used && summary.languages_used.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <p className="font-bold text-gray-700 mb-2">🗣️ Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {summary.languages_used.map((lang) => (
                    <span
                      key={lang}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {getLanguageName(lang)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Diseases */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🦠 Top Detected Diseases</h2>
            
            <div className="space-y-2">
              {summary?.top_diseases && summary.top_diseases.length > 0 ? (
                summary.top_diseases.map((disease, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <span className="text-2xl mr-2">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 capitalize">{disease.disease}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">{disease.count}</p>
                      <p className="text-xs text-gray-500">cases</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No disease data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🌍 Community Impact</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Yield Saved */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-green-700 font-bold">💰 Estimated Yield Saved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {impact?.estimated_yield_saved || 'N/A'}
              </p>
            </div>

            {/* Geographic Hotspots */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-700 font-bold">🗺️ Disease Hotspots</p>
              <div className="mt-3 space-y-2">
                {impact?.disease_hotspot_regions && impact.disease_hotspot_regions.length > 0 ? (
                  impact.disease_hotspot_regions.slice(0, 3).map((hotspot, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{hotspot.region}</span>
                      <span className="font-bold text-blue-600">{hotspot.diagnoses} cases</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No region data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Disease Breakdown Table */}
        {diseases && diseases.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔬 Detailed Disease Analysis</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-700">Disease</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Cases</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Regions</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {diseases.map((disease, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 capitalize font-semibold text-gray-800">
                        {disease.disease}
                      </td>
                      <td className="text-center py-3 px-4 text-gray-700">{disease.count}</td>
                      <td className="text-center py-3 px-4 text-gray-700">
                        {disease.regions?.length || 0}
                      </td>
                      <td className="text-center py-3 px-4">
                        <SeverityBadge
                          breakdown={disease.severity_breakdown}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-sm text-blue-700">
            <strong>📌 Dashboard Info:</strong> Data updates automatically every 30 seconds. This dashboard tracks
            all diagnoses made through the AgriVoice app to measure impact on farmers and crop health in rural communities.
          </p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, color }) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
  }

  return (
    <div className={`${colorClasses[color]} border-l-4 rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}

function SeverityBadge({ breakdown }) {
  if (!breakdown) return <span className="text-gray-500">N/A</span>

  const mild = breakdown.mild || 0
  const moderate = breakdown.moderate || 0
  const severe = breakdown.severe || 0
  const total = mild + moderate + severe

  if (total === 0) return <span className="text-gray-500">No data</span>

  return (
    <div className="flex gap-1">
      {mild > 0 && <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">{mild}</span>}
      {moderate > 0 && <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs">{moderate}</span>}
      {severe > 0 && <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">{severe}</span>}
    </div>
  )
}

function getLanguageName(code) {
  const languages = {
    en: 'English',
    sw: 'Swahili',
    ar: 'Arabic',
    fr: 'French',
    es: 'Spanish',
    pt: 'Portuguese',
  }
  return languages[code] || code
}
