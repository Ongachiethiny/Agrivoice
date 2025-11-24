import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraCapture from '@/components/CameraCapture'
import AudioRecorder from '@/components/AudioRecorder'
import { useDiagnosisStore } from '@/store/diagnosisStore'
import { apiClient } from '@/services/api'

export default function Diagnose() {
  const navigate = useNavigate()
  const store = useDiagnosisStore()
  const [step, setStep] = useState(1)
  const [userQuestion, setUserQuestion] = useState('')
  const [cropType, setCropType] = useState(store.cropType || '')
  const [region, setRegion] = useState(store.region || '')
  const [farmerId, setFarmerId] = useState(store.farmerId || '')
  const [loading, setLoading] = useState(false)

  const handleImageCapture = async (imageBlob) => {
    setLoading(true)
    try {
      const file = new File([imageBlob], 'crop.jpg', { type: 'image/jpeg' })
      const result = await apiClient.analyzeImage(file)
      store.setImage(imageBlob)
      store.setImageTags(result.tags)
      setStep(2)
    } catch (error) {
      alert(`Error analyzing image: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAudioRecord = async (audioBlob) => {
    setLoading(true)
    try {
      const result = await apiClient.speechToText(audioBlob)
      setUserQuestion(result.text)
    } catch (error) {
      alert(`Error converting speech to text: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDiagnose = async () => {
    if (!userQuestion.trim()) {
      alert('Please ask a question about your crop')
      return
    }

    setLoading(true)
    try {
      store.setCropType(cropType)
      store.setRegion(region)
      store.setFarmerId(farmerId)

      const diagnosis = await apiClient.diagnose(
        store.imageTags,
        userQuestion,
        cropType,
        region,
        farmerId
      )

      store.setDiagnosis(diagnosis)

      const treatmentPlan = await apiClient.getTreatmentPlan(diagnosis)
      store.setTreatmentPlan(treatmentPlan)

      navigate('/results/latest')
    } catch (error) {
      alert(`Error getting diagnosis: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-green-700">Diagnose Your Crop</h1>

      {step === 1 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Step 1: Capture Image</h2>
          
          {store.image ? (
            <div className="space-y-4">
              <img
                src={URL.createObjectURL(store.image)}
                alt="Captured crop"
                className="w-full rounded-lg max-h-96"
              />
              <button
                onClick={() => store.setImage(null)}
                className="w-full bg-red-600 text-white py-2 rounded-lg font-bold"
              >
                Retake Photo
              </button>
            </div>
          ) : (
            <CameraCapture onCapture={handleImageCapture} />
          )}

          {store.image && (
            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold text-lg"
            >
              Continue to Next Step →
            </button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Step 2: Describe the Issue</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-bold mb-2">Your Question *</label>
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Describe what you see in your crop and your concerns..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">Or record your question:</p>
              <AudioRecorder onRecordComplete={handleAudioRecord} />
            </div>

            <div>
              <label className="block font-bold mb-2">Crop Type (optional)</label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g., Maize, Wheat, Rice"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Region (optional)</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., East Africa, West Africa"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Your ID (optional)</label>
              <input
                type="text"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                placeholder="Farmer ID"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-bold"
              disabled={loading}
            >
              ← Back
            </button>
            <button
              onClick={handleDiagnose}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
              disabled={loading || !userQuestion.trim()}
            >
              {loading ? '🔄 Analyzing...' : '🚀 Get Diagnosis'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
