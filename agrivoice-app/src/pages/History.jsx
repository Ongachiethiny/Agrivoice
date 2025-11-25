import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/auth'

const API_URL = import.meta.env.VITE_API_URL || 'https://agrivoice-backend-aefdd2d38be7.herokuapp.com'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null)
  const [stats, setStats] = useState(null)

  // Check if user is authenticated
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }

    loadHistory()
    loadStats()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/history/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login')
          return
        }
        throw new Error('Failed to load history')
      }

      const data = await response.json()
      setHistory(data.data || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load history')
      console.error('History load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/history/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      }
    } catch (err) {
      console.error('Stats load error:', err)
    }
  }

  const handleDelete = async (diagnosisId) => {
    if (!window.confirm('Are you sure you want to delete this diagnosis?')) {
      return
    }

    try {
      const accessToken = authService.getAccessToken()
      
      const response = await fetch(`${API_URL}/api/history/delete/${diagnosisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setHistory(history.filter(h => h.id !== diagnosisId))
        setSelectedDiagnosis(null)
      }
    } catch (err) {
      setError('Failed to delete diagnosis')
      console.error('Delete error:', err)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getLanguageName = (code) => {
    const languages = {
      'en': 'English',
      'sw': 'Swahili',
      'ar': 'Arabic',
      'fr': 'French',
      'es': 'Spanish',
      'pt': 'Portuguese'
    }
    return languages[code] || code
  }

  return (
    <div className="space-y-6 py-8">
      <h1 className="text-4xl font-bold text-green-700">📋 Diagnosis History</h1>
      <p className="text-lg text-gray-600">View and manage your past crop diagnoses</p>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📊 Your Statistics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Total Diagnoses</p>
                <p className="text-3xl font-bold text-green-600">{stats.total_diagnoses}</p>
              </div>
              {stats.languages_used && (
                <div>
                  <p className="text-gray-600">Languages Used</p>
                  <p className="text-lg font-semibold">
                    {Object.keys(stats.languages_used).length} languages
                  </p>
                </div>
              )}
              {stats.top_diseases && stats.top_diseases.length > 0 && (
                <div>
                  <p className="text-gray-600">Most Common Issue</p>
                  <p className="text-lg font-semibold">{stats.top_diseases[0][0]}</p>
                  <p className="text-sm text-gray-500">Found {stats.top_diseases[0][1]} times</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History List */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">
            📝 Recent Diagnoses ({history.length})
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">⏳ Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No diagnoses yet</p>
              <p className="text-gray-500 text-sm">
                Your diagnosis history will appear here once you perform your first diagnosis.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  onClick={() => setSelectedDiagnosis(diagnosis)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedDiagnosis?.id === diagnosis.id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{diagnosis.query.substring(0, 50)}...</p>
                      <p className="text-sm text-gray-600">{formatDate(diagnosis.timestamp)}</p>
                      <p className="text-sm text-green-600 mt-1">
                        🌐 {getLanguageName(diagnosis.language)} | 🏷️ {diagnosis.detected_tags.length} tags
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(diagnosis.id)
                      }}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail View */}
      {selectedDiagnosis && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-green-700">📖 Diagnosis Detail</h2>
            <button
              onClick={() => setSelectedDiagnosis(null)}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Question Asked</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedDiagnosis.query}</p>

              <h3 className="font-bold text-lg mt-6 mb-3">Detected Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDiagnosis.detected_tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-bold text-lg mt-6 mb-3">Metadata</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Date:</span> {formatDate(selectedDiagnosis.timestamp)}</p>
                <p><span className="text-gray-600">Language:</span> {getLanguageName(selectedDiagnosis.language)}</p>
                <p><span className="text-gray-600">ID:</span> <code className="text-xs bg-gray-100 px-2 py-1">{selectedDiagnosis.id}</code></p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">🔍 Diagnosis (English)</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {selectedDiagnosis.diagnosis_text}
              </p>

              {selectedDiagnosis.translated_text && selectedDiagnosis.language !== 'en' && (
                <>
                  <h3 className="font-bold text-lg mt-6 mb-3">
                    🌐 {getLanguageName(selectedDiagnosis.language)} Translation
                  </h3>
                  <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {selectedDiagnosis.translated_text}
                  </p>
                </>
              )}

              {selectedDiagnosis.audio_base64 && (
                <>
                  <h3 className="font-bold text-lg mt-6 mb-3">🔊 Audio</h3>
                  <audio
                    controls
                    className="w-full"
                    src={`data:audio/mp3;base64,${selectedDiagnosis.audio_base64}`}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
