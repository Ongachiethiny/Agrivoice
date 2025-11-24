import React from 'react'
import { Link } from 'react-router-dom'
import ResultCard from '@/components/ResultCard'
import { useDiagnosisStore } from '@/store/diagnosisStore'

export default function Results() {
  const store = useDiagnosisStore()

  if (!store.diagnosis) {
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
        <h1 className="text-3xl font-bold text-green-700">Diagnosis Results</h1>
        <Link
          to="/diagnose"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700"
        >
          New Diagnosis
        </Link>
      </div>

      <ResultCard
        diagnosis={store.diagnosis}
        treatmentPlan={store.treatmentPlan}
      />

      {store.diagnosis.organic_solutions && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">📋 Quick Action Checklist</h2>
          <div className="space-y-2">
            {store.diagnosis.organic_solutions.slice(0, 3).map((solution, idx) => (
              <label key={idx} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="mr-3" />
                <span className="text-gray-700">{solution}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          🖨️ Print Results
        </button>
        <button
          onClick={() => alert('Shared! (Feature coming soon)')}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700"
        >
          📤 Share Results
        </button>
      </div>
    </div>
  )
}
