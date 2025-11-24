import React from 'react'
import { useDiagnosisStore } from '@/store/diagnosisStore'

export default function Profile() {
  const store = useDiagnosisStore()
  const [editing, setEditing] = React.useState(false)
  const [tempData, setTempData] = React.useState({
    farmerId: store.farmerId,
    region: store.region,
    cropType: store.cropType,
  })

  const handleSave = () => {
    store.setFarmerId(tempData.farmerId)
    store.setRegion(tempData.region)
    store.setCropType(tempData.cropType)
    setEditing(false)
  }

  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-green-700">👤 My Profile</h1>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {!editing ? (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm">Farmer ID</p>
              <p className="text-xl font-semibold">{store.farmerId || 'Not set'}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm">Region</p>
              <p className="text-xl font-semibold">{store.region || 'Not set'}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600 text-sm">Primary Crop Type</p>
              <p className="text-xl font-semibold">{store.cropType || 'Not set'}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2">Farmer ID</label>
              <input
                type="text"
                value={tempData.farmerId}
                onChange={(e) => setTempData({ ...tempData, farmerId: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Region</label>
              <input
                type="text"
                value={tempData.region}
                onChange={(e) => setTempData({ ...tempData, region: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Primary Crop Type</label>
              <input
                type="text"
                value={tempData.cropType}
                onChange={(e) => setTempData({ ...tempData, cropType: e.target.value })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTempData({
                    farmerId: store.farmerId,
                    region: store.region,
                    cropType: store.cropType,
                  })
                  setEditing(false)
                }}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg shadow p-8">
        <h2 className="text-xl font-bold mb-4">📱 About AgriVoice</h2>
        <p className="text-gray-700 mb-4">
          AgriVoice is an AI-powered platform designed to help African farmers diagnose crop diseases and receive organic treatment recommendations.
        </p>
        <p className="text-gray-700 text-sm">Version 1.0.0</p>
      </div>
    </div>
  )
}
