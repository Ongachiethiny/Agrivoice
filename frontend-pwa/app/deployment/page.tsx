"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle2, Circle, ExternalLink } from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  details: string[]
  completed: boolean
}

const deploymentChecklist: ChecklistItem[] = [
  {
    id: "frontend",
    title: "Frontend Deployment",
    description: "Deploy React app to Vercel or Netlify",
    details: [
      "Run: npm run build",
      "Push to GitHub repository",
      "Connect repository to Vercel/Netlify",
      "Configure environment variables",
      "Deploy and verify functionality",
    ],
    completed: false,
  },
  {
    id: "backend",
    title: "Backend Deployment",
    description: "Deploy Python/Node.js backend to Render or Azure",
    details: [
      "Create Docker image for backend",
      "Push Docker image to registry",
      "Configure backend service on Render/Azure",
      "Set environment variables (Azure Keys, API endpoints)",
      "Deploy and run health checks",
      "Enable CORS for Copilot Studio",
    ],
    completed: false,
  },
  {
    id: "integration",
    title: "Copilot Integration",
    description: "Connect Copilot Studio with backend APIs",
    details: [
      "Update API Base URL in manifest with production URL",
      "Download updated manifest.json from admin panel",
      "Import manifest into Copilot Studio",
      "Configure authentication (if needed)",
      "Test each API action in Copilot",
      "Publish Copilot agent",
    ],
    completed: false,
  },
  {
    id: "fabric",
    title: "Microsoft Fabric Setup",
    description: "Configure data logging to Fabric Lakehouse",
    details: [
      "Create Fabric Lakehouse workspace",
      "Configure tables for diagnosis data",
      "Generate Fabric API credentials",
      "Update backend .env with FABRIC_KEY",
      "Test data logging with test diagnosis",
      "Create Fabric Dashboard for impact metrics",
    ],
    completed: false,
  },
  {
    id: "testing",
    title: "End-to-End Testing",
    description: "Verify complete system functionality",
    details: [
      "Test farmer app image upload and diagnosis",
      "Test voice input and audio output",
      "Verify Copilot triggers correct API actions",
      "Check data logging to Fabric",
      "Test admin dashboard displays live data",
      "Verify error handling and edge cases",
    ],
    completed: false,
  },
  {
    id: "monitoring",
    title: "Monitoring & Maintenance",
    description: "Set up observability for production",
    details: [
      "Configure logging (Sentry or similar)",
      "Set up API monitoring and alerts",
      "Enable performance profiling",
      "Create runbook for common issues",
      "Set up backup strategy",
      "Plan regular maintenance windows",
    ],
    completed: false,
  },
]

export default function DeploymentChecklist() {
  const [checklist, setChecklist] = useState(deploymentChecklist)

  const handleLogout = () => {
    console.log("[v0] User logging out")
  }

  const toggleItem = (id: string) => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const completedCount = checklist.filter((item) => item.completed).length
  const completionPercentage = Math.round((completedCount / checklist.length) * 100)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      <Header />

      <main className="ml-64 mt-16 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Deployment Checklist</h1>
          <p className="text-muted-foreground mt-1">Step-by-step guide to deploy AgriVoice to production</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {completedCount} of {checklist.length} sections completed
            </p>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <div className="space-y-4">
          {checklist.map((section) => (
            <Card
              key={section.id}
              className={`cursor-pointer transition-all hover:shadow-md ${section.completed ? "opacity-75" : ""}`}
              onClick={() => toggleItem(section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleItem(section.id)
                    }}
                    className="mt-1 flex-shrink-0"
                  >
                    {section.completed ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <CardTitle className={section.completed ? "line-through text-muted-foreground" : ""}>
                      {section.title}
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 ml-10">
                  {section.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className={`text-sm flex items-start gap-2 ${section.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful links for deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="#"
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="text-sm font-medium flex-1">Vercel Deployment Docs</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="text-sm font-medium flex-1">Azure App Service Guide</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="text-sm font-medium flex-1">Copilot Studio Setup</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors group"
              >
                <span className="text-sm font-medium flex-1">Microsoft Fabric Integration</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
