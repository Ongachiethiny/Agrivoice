import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraCapture from '@/components/CameraCapture'
import AudioRecorder from '@/components/AudioRecorder'
import { useDiagnosisStore } from '@/store/diagnosisStore'
import { apiClient } from '@/services/api'

export default function Diagnose() {
  const navigate = useNavigate()
  const store = useDiagnosisStore()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [question, setQuestion] = useState('')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageSelected = (file) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setError(null)
  }

  const handleAudioRecord = (text) => {
    setQuestion(text)
  }

  const handleDiagnose = async () => {
    if (!imageFile) {
      setError('Please upload an image')
      return
    }
    if (!question.trim()) {
      setError('Please enter a question or record audio')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call the main diagnosis endpoint
      const result = await apiClient.diagnose(imageFile, question, language)
      
      // Store result
      store.setDiagnosis(result.data)
      
      // Navigate to results
      navigate('/results/latest')
    } catch (err) {
      setError(err.message || 'Failed to diagnose crop')
      console.error('Diagnosis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-green-700">🌾 Diagnose Your Crop</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Image Upload Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📸 Step 1: Upload Image</h2>
          
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Crop preview"
                className="w-full rounded-lg max-h-96 object-cover"
              />
              <button
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
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
              <label htmlFor="image-input" className="cursor-pointer">
                <div className="text-6xl mb-2">📷</div>
                <p className="text-lg font-bold text-green-700">Click to upload photo</p>
                <p className="text-sm text-gray-500">or take a camera picture</p>
              </label>
            </div>
          )}
        </div>

        {/* Question Input Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">❓ Step 2: Ask Your Question</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2">What's wrong with your crop? *</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Describe what you see... yellowing leaves, brown spots, wilting, etc."
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none resize-none"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">Or record your question:</p>
              <AudioRecorder onRecordComplete={handleAudioRecord} />
            </div>

            {question && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">Your question:</p>
                <p className="text-gray-700">{question}</p>
              </div>
            )}

            <div>
              <label className="block font-bold mb-2">🌍 Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleDiagnose}
          disabled={loading || !imageFile || !question.trim()}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition"
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Analyzing your crop...
            </>
          ) : (
            <>✅ Get Diagnosis</>
          )}
        </button>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-700">
            <strong>💡 Tip:</strong> Take a clear photo of the affected area in good lighting for best results.
          </p>
        </div>
      </div>
    </div>
  )
}
