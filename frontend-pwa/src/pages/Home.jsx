import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-8 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          🌾 AgriVoice
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          AI-Powered Crop Health Diagnosis for African Farmers
        </p>
        <p className="text-gray-700 mb-8">
          Instantly diagnose crop diseases using your smartphone camera and get organic treatment recommendations.
        </p>
        <Link
          to="/diagnose"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition"
        >
          Start Diagnosis 🚀
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-xl font-bold mb-2">Snap & Analyze</h3>
          <p className="text-gray-600">
            Take a photo of your crop and our AI analyzes it instantly.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI Diagnosis</h3>
          <p className="text-gray-600">
            Get accurate disease diagnosis powered by GPT-4 and Azure Vision.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-bold mb-2">Organic Solutions</h3>
          <p className="text-gray-600">
            Receive sustainable, organic treatment plans for your crops.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold">Capture Image</h4>
              <p className="text-gray-600">Take a clear photo of the affected crop area</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold">Describe Issue</h4>
              <p className="text-gray-600">Type or speak about the problem you're facing</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold">Get Diagnosis</h4>
              <p className="text-gray-600">Receive AI-powered diagnosis and treatment plan</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h4 className="font-bold">Start Treatment</h4>
              <p className="text-gray-600">Follow the organic treatment recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
