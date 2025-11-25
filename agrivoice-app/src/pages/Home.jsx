import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          🌾 Welcome to AgriVoice
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered crop diagnosis and analytics platform empowering African farmers with intelligent solutions for crop health management.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/diagnose"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
          >
            🌾 Start Diagnosis
          </Link>
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition"
          >
            📊 View Analytics
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">📸</div>
          <h3 className="text-xl font-bold mb-2">Visual Diagnosis</h3>
          <p className="text-gray-600">
            Upload a photo of your crop and get instant AI-powered diagnosis using advanced computer vision technology.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-bold mb-2">Multilingual Support</h3>
          <p className="text-gray-600">
            Get advice in your local language. We support English, Swahili, Arabic, French, Spanish, and Portuguese.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
          <p className="text-gray-600">
            Track disease outbreaks, community impact, and farming metrics in real-time through our analytics dashboard.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
              1️⃣
            </div>
            <h4 className="font-bold mb-2">Upload Image</h4>
            <p className="text-gray-600 text-sm">Take or upload a photo of your crop</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
              2️⃣
            </div>
            <h4 className="font-bold mb-2">Ask Question</h4>
            <p className="text-gray-600 text-sm">Describe what you observe about the crop</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
              3️⃣
            </div>
            <h4 className="font-bold mb-2">Get Diagnosis</h4>
            <p className="text-gray-600 text-sm">Receive instant AI diagnosis and recommendations</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
              4️⃣
            </div>
            <h4 className="font-bold mb-2">Act & Save</h4>
            <p className="text-gray-600 text-sm">Follow recommendations to save your crop</p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Diagnose Your Crops?</h2>
        <p className="text-lg mb-8 opacity-90">Get instant AI-powered guidance for your crops</p>
        <Link
          to="/diagnose"
          className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition inline-block"
        >
          Start Now →
        </Link>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              ✅ Crop Disease Detection
            </h3>
            <p className="text-gray-600">
              Powered by Azure Computer Vision, our system identifies over 20 common crop diseases with high accuracy.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              ✅ Smart Recommendations
            </h3>
            <p className="text-gray-600">
              Get organic and sustainable treatment plans generated by Azure GPT-4 for each detected disease.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              ✅ Voice Support
            </h3>
            <p className="text-gray-600">
              Ask questions using voice input and hear responses in your local language through Azure Speech Services.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              ✅ Community Impact
            </h3>
            <p className="text-gray-600">
              Track disease outbreaks and community-wide metrics to help predict and prevent agricultural crises.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
