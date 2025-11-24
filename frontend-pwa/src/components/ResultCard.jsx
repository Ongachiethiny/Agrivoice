import React from 'react'

export default function ResultCard({ diagnosis, treatmentPlan }) {
  if (!diagnosis) return null

  return (
    <div className="result-card bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Diagnosis Summary */}
      <div className={`p-4 rounded-lg ${
        diagnosis.severity === 'high' ? 'bg-red-100' :
        diagnosis.severity === 'medium' ? 'bg-yellow-100' :
        'bg-green-100'
      }`}>
        <h2 className="text-2xl font-bold mb-2">🔍 Diagnosis</h2>
        <p className="text-xl font-semibold">{diagnosis.disease_name}</p>
        <p className="text-gray-700 mt-2">
          Severity: <span className="font-bold">{diagnosis.severity.toUpperCase()}</span>
        </p>
        <p className="text-gray-700">
          Confidence: {(diagnosis.confidence * 100).toFixed(0)}%
        </p>
      </div>

      {/* Detailed Diagnosis */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">📋 Details</h3>
        <p className="text-gray-700">{diagnosis.diagnosis}</p>
      </div>

      {/* Organic Solutions */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">🌱 Organic Solutions</h3>
        <ul className="space-y-2">
          {diagnosis.organic_solutions.map((solution, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-green-600 mr-3">✓</span>
              <span className="text-gray-700">{solution}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prevention Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">🛡️ Prevention Tips</h3>
        <ul className="space-y-2">
          {diagnosis.prevention.map((tip, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-blue-600 mr-3">•</span>
              <span className="text-gray-700">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recovery Timeline */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">⏱️ Recovery Timeline</h3>
        <p className="text-gray-700">
          Estimated recovery: <span className="font-bold">{diagnosis.estimated_recovery_days} days</span>
        </p>
      </div>

      {/* Treatment Plan */}
      {treatmentPlan && (
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-3">📅 Week-by-Week Treatment Plan</h3>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-indigo-700">Week 1</p>
              <p className="text-gray-700">{treatmentPlan.week_1}</p>
            </div>
            <div>
              <p className="font-semibold text-indigo-700">Week 2</p>
              <p className="text-gray-700">{treatmentPlan.week_2}</p>
            </div>
            <div>
              <p className="font-semibold text-indigo-700">Week 3</p>
              <p className="text-gray-700">{treatmentPlan.week_3}</p>
            </div>
            <div>
              <p className="font-semibold text-indigo-700">Week 4</p>
              <p className="text-gray-700">{treatmentPlan.week_4}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
