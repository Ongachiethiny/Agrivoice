"use client"

import { useState, useEffect } from "react"
import { Leaf, LogOut, Menu, X, Activity, TrendingUp, Users, AlertCircle, BarChart3, Zap } from "lucide-react"

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-950 shadow-xl sticky top-0 z-40 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold">
                <span className="text-white">Agri</span>
                <span className="text-green-500">Voice</span>
              </span>
              <span className="ml-4 px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-semibold">
                DevOps Admin
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="p-2 text-slate-400 hover:text-green-500 hover:bg-slate-800 rounded-lg transition">
                <Activity className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
                <div className="text-right">
                  <p className="font-semibold text-white">{user?.name || "Admin"}</p>
                  <p className="text-xs text-slate-400">System Admin</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden mt-4 space-y-3 border-t border-slate-700 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-400 font-semibold p-2 hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-700 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {["overview", "copilot", "deployment"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-semibold transition capitalize ${
                activeTab === tab ? "text-green-500 border-b-2 border-green-500" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "overview" && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 border border-green-700/50 rounded-xl p-6 hover:border-green-500/50 transition">
                <Activity className="w-8 h-8 text-green-500 mb-3" />
                <p className="text-slate-400 text-sm">Total Diagnoses</p>
                <p className="text-3xl font-bold text-white mt-1">2,847</p>
                <p className="text-xs text-green-400 mt-2">+24% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-700/50 rounded-xl p-6 hover:border-blue-500/50 transition">
                <Users className="w-8 h-8 text-blue-500 mb-3" />
                <p className="text-slate-400 text-sm">Active Farmers</p>
                <p className="text-3xl font-bold text-white mt-1">1,243</p>
                <p className="text-xs text-blue-400 mt-2">+12% this week</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-700/50 rounded-xl p-6 hover:border-purple-500/50 transition">
                <TrendingUp className="w-8 h-8 text-purple-500 mb-3" />
                <p className="text-slate-400 text-sm">Success Rate</p>
                <p className="text-3xl font-bold text-white mt-1">94.2%</p>
                <p className="text-xs text-purple-400 mt-2">+3.1% improvement</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-700/50 rounded-xl p-6 hover:border-orange-500/50 transition">
                <AlertCircle className="w-8 h-8 text-orange-500 mb-3" />
                <p className="text-slate-400 text-sm">System Health</p>
                <p className="text-3xl font-bold text-white mt-1">99.8%</p>
                <p className="text-xs text-orange-400 mt-2">All systems operational</p>
              </div>
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Daily Diagnoses
                </h3>
                <div className="h-64 bg-slate-900/50 rounded-lg flex items-end justify-around p-4">
                  {[45, 52, 48, 61, 55, 67, 72].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg w-8"
                        style={{ height: `${(val / 80) * 180}px` }}
                      />
                      <span className="text-xs text-slate-400">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  API Performance
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Computer Vision", status: "operational", latency: "245ms" },
                    { name: "GPT-4 Integration", status: "operational", latency: "1.2s" },
                    { name: "Translator Service", status: "operational", latency: "180ms" },
                    { name: "Voice Processing", status: "operational", latency: "320ms" },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <span className="text-slate-300">{service.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{service.latency}</span>
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "copilot" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Copilot Studio Integration</h2>
            <p className="text-slate-400 mb-6">Connected and ready. All manifests generated automatically.</p>
            <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
              <pre>{`{
  "version": "1.0",
  "actions": [
    { "id": "diagnose-crop", "type": "function" },
    { "id": "translate-advice", "type": "function" },
    { "id": "record-diagnosis", "type": "database" }
  ]
}`}</pre>
            </div>
          </div>
        )}

        {activeTab === "deployment" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Deployment Status</h2>
            <div className="space-y-4">
              {[
                { step: "Database Migrations", status: "completed" },
                { step: "API Keys Configuration", status: "completed" },
                { step: "Copilot Studio Setup", status: "completed" },
                { step: "Power Automate Flows", status: "active" },
                { step: "Monitoring & Alerts", status: "active" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
                  <div
                    className={`w-3 h-3 rounded-full ${item.status === "completed" ? "bg-green-500" : "bg-blue-500"}`}
                  />
                  <span className="text-slate-300">{item.step}</span>
                  <span
                    className={`ml-auto text-sm font-semibold ${item.status === "completed" ? "text-green-400" : "text-blue-400"}`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
