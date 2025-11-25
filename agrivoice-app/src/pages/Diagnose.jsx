import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api'
import { exportService } from '@/services/export'

export default function Diagnose() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [question, setQuestion] = useState('')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [diagnosis, setDiagnosis] = useState(null)
  const [exporting, setExporting] = useState(false)

  const handleImageSelected = (file) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleDiagnose = async () => {
    if (!imageFile) {
      setError('Please upload an image')
      return
    }
    if (!question.trim()) {
      setError('Please enter a question about your crop')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.diagnose(imageFile, question, language)
      setDiagnosis(result.data)
    } catch (err) {
      setError(err.message || 'Failed to diagnose crop')
      console.error('Diagnosis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportDiagnosis = async () => {
    if (!diagnosis?.id) {
      setError('No diagnosis available to export')
      return
    }

    try {
      setExporting(true)
      await exportService.downloadDiagnosisPDF(diagnosis.id)
      setError(null)
    } catch (err) {
      setError(`Failed to export diagnosis: ${err.message}`)
      console.error('Export error:', err)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6 py-8">
      <h1 className="text-4xl font-bold text-green-700">🌾 Diagnose Your Crop</h1>
      <p className="text-lg text-gray-600">Upload a photo and describe what you see for instant AI diagnosis</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold">📸 Upload & Ask</h2>

          {/* Image Upload */}
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Crop preview"
                className="w-full rounded-lg max-h-64 object-cover"
              />
              <button
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                  setDiagnosis(null)
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold"
              >
                ❌ Remove Photo
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-green-400 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files?.[0] && handleImageSelected(e.target.files[0])}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <div className="text-5xl mb-2">📷</div>
                <p className="text-lg font-bold text-green-700">Click to upload photo</p>
                <p className="text-sm text-gray-500">or take from camera</p>
              </label>
            </div>
          )}

          {/* Question Input */}
          <div>
            <label className="block font-bold mb-2">What's wrong with your crop?</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Describe what you see... yellowing leaves, brown spots, wilting, etc."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Language Selector */}
          <div>
            <label className="block font-bold mb-2">🌍 Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg"
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="pt">Portuguese</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleDiagnose}
            disabled={loading || !imageFile || !question.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white py-3 rounded-lg font-bold text-lg"
          >
            {loading ? '⏳ Analyzing...' : '✅ Get Diagnosis'}
          </button>
        </div>

        {/* Results Display */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {diagnosis ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-700">🔍 Diagnosis Results</h2>
                <button
                  onClick={handleExportDiagnosis}
                  disabled={exporting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  {exporting ? '⏳' : '📥'} Export PDF
                </button>
              </div>

              {/* Detected Tags */}
              {diagnosis.tags && diagnosis.tags.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3">Detected Issues:</h3>
                  <div className="flex flex-wrap gap-2">
                    {diagnosis.tags.map((tag, idx) => (
                      <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagnosis Text */}
              {diagnosis.diagnosis?.original_text && (
                <div>
                  <h3 className="font-bold mb-2">📋 Diagnosis:</h3>
                  <p className="bg-gray-50 p-4 rounded-lg text-gray-700">
                    {diagnosis.diagnosis.original_text}
                  </p>
                </div>
              )}

              {/* Translation */}
              {diagnosis.diagnosis?.translated_text && language !== 'en' && (
                <div>
                  <h3 className="font-bold mb-2">🌐 Translation:</h3>
                  <p className="bg-blue-50 p-4 rounded-lg text-gray-700">
                    {diagnosis.diagnosis.translated_text}
                  </p>
                </div>
              )}

              {/* Audio */}
              {diagnosis.audio?.base64 && (
                <div>
                  <h3 className="font-bold mb-2">🔊 Listen to Advice:</h3>
                  <audio
                    controls
                    className="w-full"
                    src={`data:audio/mp3;base64,${diagnosis.audio.base64}`}
                  />
                </div>
              )}

              {/* Action Items */}
              {diagnosis.action_items && diagnosis.action_items.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3">✅ Action Items:</h3>
                  <ul className="space-y-2">
                    {diagnosis.action_items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🌾</div>
              <p className="text-gray-600">Upload an image and ask a question to get diagnosis results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
