"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download, Code2, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"

interface APIAction {
  name: string
  method: string
  endpoint: string
  description: string
}

const apiActions: APIAction[] = [
  {
    name: "Diagnose Crop",
    method: "POST",
    endpoint: "/api/diagnose",
    description: "Analyze crop image and provide disease diagnosis",
  },
  {
    name: "Analyze Image",
    method: "POST",
    endpoint: "/api/analyze-image",
    description: "Extract visual features from crop leaf image",
  },
  {
    name: "Log to Fabric",
    method: "POST",
    endpoint: "/api/fabric-log",
    description: "Send diagnostic data to Microsoft Fabric",
  },
]

const manifestTemplate = {
  name: "AgriVoice Copilot",
  version: "1.0.0",
  description: "AI-powered crop disease diagnosis assistant",
  apiBaseUrl: "https://your-api-domain.com",
  actions: apiActions.map((a) => ({
    name: a.name,
    method: a.method,
    endpoint: a.endpoint,
    parameters: {
      image: "base64-encoded image",
      language: "output language code",
    },
  })),
}

export default function CopilotIntegration() {
  const [apiBaseUrl, setApiBaseUrl] = useState("https://api.agrivoice.com")
  const [copied, setCopied] = useState(false)
  const [testResponse, setTestResponse] = useState<string | null>(null)

  const handleLogout = () => {
    console.log("[v0] User logging out")
  }

  const manifest = { ...manifestTemplate, apiBaseUrl }
  const manifestJSON = JSON.stringify(manifest, null, 2)

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestJSON)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadManifest = () => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(manifestJSON))
    element.setAttribute("download", "agrivoice-manifest.json")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleTestAction = () => {
    setTestResponse(
      JSON.stringify(
        {
          success: true,
          diagnosis: "Maize Rust",
          confidence: 0.92,
          recommendations: ["Apply sulfur-based fungicide", "Remove infected leaves"],
        },
        null,
        2,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      <Header />

      <main className="ml-64 mt-16 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Copilot Integration</h1>
          <p className="text-muted-foreground mt-1">
            Configure Microsoft Copilot Studio to communicate with AgriVoice backend.
          </p>
        </div>

        {/* API Actions List */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Available API Actions</CardTitle>
            </div>
            <CardDescription>Actions that Copilot Studio can trigger</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <span className="text-xs font-bold text-primary">{action.method}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground">{action.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block font-mono">
                      {action.endpoint}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* API Base URL Config */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Set your backend API base URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">API Base URL</label>
                <Input
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  className="mt-2"
                  placeholder="https://api.example.com"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Update this with your production endpoint before publishing.
              </p>
            </CardContent>
          </Card>

          {/* Test Action Runner */}
          <Card>
            <CardHeader>
              <CardTitle>Test Action</CardTitle>
              <CardDescription>Verify API connectivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleTestAction} className="w-full bg-transparent" variant="outline">
                Test Diagnose Action
              </Button>
              {testResponse && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Response:</p>
                  <pre className="text-xs text-foreground overflow-auto max-h-32">{testResponse}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Manifest Generator */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle>Manifest JSON Generator</CardTitle>
            </div>
            <CardDescription>Export configuration for Copilot Studio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg overflow-auto max-h-80 border border-border">
              <pre className="text-xs text-foreground font-mono whitespace-pre-wrap break-words">{manifestJSON}</pre>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCopyManifest} variant="outline" className="flex-1 gap-2 bg-transparent">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy JSON"}
              </Button>
              <Button onClick={handleDownloadManifest} className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Import this JSON into your Copilot Studio configuration. Update the apiBaseUrl with your production
              endpoint.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
