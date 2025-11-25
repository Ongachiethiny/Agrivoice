import React from 'react'
import { Link } from 'react-router-dom'
import { useDiagnosisStore } from '@/store/diagnosisStore'

export default function Results() {
  const store = useDiagnosisStore()
  const diagnosis = store.diagnosis?.data || store.diagnosis

  if (!diagnosis) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">No diagnosis available</p>
        <Link to="/diagnose" className="text-green-600 font-bold hover:underline">
          Start a new diagnosis →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">✅ Diagnosis Results</h1>
        <Link
          to="/diagnose"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700"
        >
          New Diagnosis
        </Link>
      </div>

      {/* Detected Issues */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold text-red-600">🔍 Issues Detected</h2>
        <div className="flex flex-wrap gap-2">
          {diagnosis.detected_tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Diagnosis Text */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold text-green-700">💊 Treatment Plan</h2>
        
        {/* Original Diagnosis */}
        <div>
          <h3 className="font-bold text-lg mb-2">📝 Full Recommendation:</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {diagnosis.diagnosis?.original_text}
          </p>
        </div>

        {/* Translated Diagnosis */}
        {diagnosis.diagnosis?.translated_text && diagnosis.diagnosis?.language !== 'en' && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h3 className="font-bold text-lg mb-2">
              🌍 In {getLanguageName(diagnosis.diagnosis.language)}:
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {diagnosis.diagnosis.translated_text}
            </p>
          </div>
        )}

        {/* Audio Response */}
        {diagnosis.audio?.base64 && (
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h3 className="font-bold text-lg mb-2">🎤 Listen to Advice:</h3>
            <audio controls className="w-full">
              <source
                src={`data:audio/mp3;base64,${diagnosis.audio.base64}`}
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>

      {/* Action Items */}
      <div className="bg-green-50 rounded-lg shadow-lg p-8 border-l-4 border-green-400">
        <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Immediate Actions</h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            1️⃣ Isolate affected plants immediately to prevent spread
          </p>
          <p className="text-gray-700">
            2️⃣ Follow the organic treatment plan above
          </p>
          <p className="text-gray-700">
            3️⃣ Monitor your crop daily for improvement
          </p>
          <p className="text-gray-700">
            4️⃣ Clean tools and hands after handling diseased plants
          </p>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
        >
          🖨️ Print Results
        </button>
        <button
          onClick={() => {
            const text = `AgriVoice Diagnosis\n\nIssues: ${diagnosis.detected_tags?.join(', ')}\n\n${diagnosis.diagnosis?.original_text}`;
            navigator.share ? navigator.share({
              title: 'My Crop Diagnosis',
              text: text,
            }) : alert('Copy this and share:\n\n' + text);
          }}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition"
        >
          📤 Share Results
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-700">
          <strong>📌 Note:</strong> This diagnosis is based on AI analysis. For severe cases, consult a local agricultural expert.
        </p>
      </div>
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
