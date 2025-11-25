"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle, CheckCircle, Zap, Activity, Gauge, Server, TrendingUp } from "lucide-react"
import { useState } from "react"

const requestData = [
  { time: "00:00", requests: 120, errors: 5, latency: 45 },
  { time: "04:00", requests: 145, errors: 3, latency: 38 },
  { time: "08:00", requests: 320, errors: 8, latency: 52 },
  { time: "12:00", requests: 450, errors: 12, latency: 65 },
  { time: "16:00", requests: 380, errors: 7, latency: 55 },
  { time: "20:00", requests: 290, errors: 4, latency: 42 },
  { time: "24:00", requests: 180, errors: 2, latency: 38 },
]

const flowStatusData = [
  { name: "Vision API", status: "healthy", uptime: 99.9, avgTime: 1245 },
  { name: "GPT-4 Analysis", status: "healthy", uptime: 99.8, avgTime: 3420 },
  { name: "Translator", status: "healthy", uptime: 99.95, avgTime: 890 },
  { name: "Power Automate Flow", status: "warning", uptime: 98.5, avgTime: 5120 },
]

export default function DevOpsDashboard() {
  const [showKeys, setShowKeys] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gauge className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              DevOps Dashboard
            </h2>
          </div>
          <p className="text-muted-foreground">Real-time monitoring of Azure APIs and Power Automate flows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Requests (24h)</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  2,485
                </p>
                <p className="text-xs text-muted-foreground mt-1">+12% from yesterday</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 hover:border-accent/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg Latency</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                  48.8ms
                </p>
                <p className="text-xs text-muted-foreground mt-1">-2.3% improvement</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <Zap className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 hover:border-destructive/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Error Rate</p>
                <p className="text-3xl font-bold mt-2">0.28%</p>
                <p className="text-xs text-muted-foreground mt-1">Healthy</p>
              </div>
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 hover:border-chart-1/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Uptime (30d)</p>
                <p className="text-3xl font-bold mt-2 text-chart-1">99.94%</p>
                <p className="text-xs text-muted-foreground mt-1">SLA compliant</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-1/10 text-chart-1">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Request Volume (24h)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={requestData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="var(--color-chart-1)"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-accent" />
              Error Rate & Latency
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={requestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Bar dataKey="errors" fill="var(--color-destructive)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="latency" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-center gap-2 mb-6">
            <Server className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Azure Services Status</h3>
          </div>
          <div className="space-y-3">
            {flowStatusData.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full transition-all ${
                      service.status === "healthy"
                        ? "bg-chart-1 shadow-lg shadow-chart-1/50"
                        : "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">Avg Response: {service.avgTime}ms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={service.status === "healthy" ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {service.uptime}% uptime
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {service.status === "healthy" ? "Operational" : "Degraded"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">System Logs</h3>
          </div>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-lg p-1">
              <TabsTrigger value="recent" className="text-xs">
                Recent
              </TabsTrigger>
              <TabsTrigger value="errors" className="text-xs">
                Errors
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-xs">
                Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="mt-4 space-y-2">
              {[
                { time: "14:32:45", service: "Vision API", message: "Image processed successfully", type: "success" },
                { time: "14:31:22", service: "GPT-4 Analysis", message: "Fungal infection detected", type: "success" },
                { time: "14:30:15", service: "Translator", message: "Response translated to Swahili", type: "success" },
                { time: "14:29:48", service: "Power Automate", message: "Flow execution completed", type: "success" },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-border transition-colors hover:bg-muted/70"
                >
                  <span className="text-muted-foreground">[{log.time}]</span>{" "}
                  <span className="text-primary font-semibold">{log.service}</span> <span>{log.message}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="errors" className="mt-4">
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border border-border/50">
                <CheckCircle className="h-5 w-5 text-chart-1" />
                <p className="text-sm text-muted-foreground">No errors in the last 24 hours</p>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4 space-y-2">
              {[
                { service: "Power Automate Flow", avgTime: "5120ms", percentile: "p95" },
                { service: "GPT-4 Analysis", avgTime: "3420ms", percentile: "p95" },
              ].map((perf, idx) => (
                <div
                  key={idx}
                  className="text-xs font-mono p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-border transition-colors"
                >
                  <span className="text-muted-foreground">[{perf.percentile}]</span>{" "}
                  <span className="text-accent font-semibold">{perf.service}</span> <span>{perf.avgTime}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
