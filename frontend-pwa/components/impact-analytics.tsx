"use client"

import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, Leaf, MapPin, Zap, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const diseaseData = [
  { name: "Maize Rust", cases: 245, region: "East" },
  { name: "Leaf Spot", cases: 189, region: "West" },
  { name: "Blight", cases: 156, region: "Central" },
  { name: "Mosaic Virus", cases: 98, region: "South" },
  { name: "Powdery Mildew", cases: 67, region: "North" },
]

const regionData = [
  { name: "East Region", value: 245, color: "var(--color-chart-1)" },
  { name: "West Region", value: 189, color: "var(--color-chart-2)" },
  { name: "Central Region", value: 156, color: "var(--color-chart-3)" },
  { name: "South Region", value: 98, color: "var(--color-chart-4)" },
  { name: "North Region", value: 67, color: "var(--color-chart-5)" },
]

const timeSeriesData = [
  { month: "Aug", diagnoses: 145, farmers: 89 },
  { month: "Sep", diagnoses: 203, farmers: 124 },
  { month: "Oct", diagnoses: 289, farmers: 167 },
  { month: "Nov", diagnoses: 355, farmers: 201 },
]

const cropData = [
  { crop: "Maize", diagnoses: 412, successRate: 94 },
  { crop: "Tomato", diagnoses: 156, successRate: 91 },
  { crop: "Bean", diagnoses: 98, successRate: 88 },
  { crop: "Rice", diagnoses: 87, successRate: 93 },
]

export default function ImpactAnalytics() {
  const totalDiagnoses = diseaseData.reduce((sum, d) => sum + d.cases, 0)
  const totalFarmers = 589

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Impact Analytics
            </h2>
          </div>
          <p className="text-muted-foreground">
            Real-time tracking of crop diagnoses and agricultural sustainability impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 border-border/50 hover:border-chart-1/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Diagnoses</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-chart-1 to-chart-1/70 bg-clip-text text-transparent">
                  {totalDiagnoses}
                </p>
                <p className="text-xs text-chart-1 mt-1 font-medium">↑ 23% this month</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-1/10 text-chart-1">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 hover:border-chart-2/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active Farmers</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-chart-2 to-chart-2/70 bg-clip-text text-transparent">
                  {totalFarmers}
                </p>
                <p className="text-xs text-chart-2 mt-1 font-medium">↑ 18% this month</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-2/10 text-chart-2">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 hover:border-chart-3/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-chart-3 to-chart-3/70 bg-clip-text text-transparent">
                  91.5%
                </p>
                <p className="text-xs text-chart-3 mt-1 font-medium">Disease identification</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-3/10 text-chart-3">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Coverage Area</p>
                <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  5
                </p>
                <p className="text-xs text-primary mt-1 font-medium">Regions monitored</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-chart-1" />
              Top Diseases by Region
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={diseaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                  }}
                />
                <Bar dataKey="cases" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-chart-2" />
              Diagnoses by Region
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Diagnoses & Farmers Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="diagnoses"
                stroke="var(--color-chart-1)"
                strokeWidth={3}
                dot={{ fill: "var(--color-chart-1)", r: 5 }}
                name="Diagnoses"
              />
              <Line
                type="monotone"
                dataKey="farmers"
                stroke="var(--color-chart-2)"
                strokeWidth={3}
                dot={{ fill: "var(--color-chart-2)", r: 5 }}
                name="Active Farmers"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border/50 bg-gradient-to-br from-card to-card/50">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Crop Success Rates
          </h3>
          <div className="space-y-4">
            {cropData.map((crop, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between group p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{crop.crop}</p>
                  <p className="text-xs text-muted-foreground">{crop.diagnoses} total diagnoses</p>
                </div>
                <div className="flex items-center gap-4 min-w-fit">
                  <div className="w-40 h-2 bg-muted/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-chart-1 to-chart-1/70 rounded-full transition-all"
                      style={{ width: `${crop.successRate}%` }}
                    ></div>
                  </div>
                  <Badge variant="default" className="min-w-14 justify-center">
                    {crop.successRate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/50 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-primary/20 text-primary mt-1">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Early Intervention Success</h4>
                <p className="text-sm text-muted-foreground">
                  Farmers who applied treatment within 24 hours of diagnosis showed 94% disease recovery rate
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 hover:border-accent/50 transition-all">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-accent/20 text-accent mt-1">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Regional Outbreak Alert</h4>
                <p className="text-sm text-muted-foreground">
                  Maize Rust spike detected in East Region. Recommend preventive measures for adjacent areas
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
