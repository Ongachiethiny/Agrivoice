import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: number
}

export default function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend !== undefined && (
          <p className={`text-xs font-medium mt-2 ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? "+" : ""}
            {trend}% vs yesterday
          </p>
        )}
      </CardContent>
    </Card>
  )
}
