"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Moon, Footprints, Flame } from "lucide-react"

const healthMetrics = [
  {
    id: 1,
    title: "Sleep",
    value: "7h 32m",
    target: "8h goal",
    progress: 94,
    icon: Moon,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    id: 2,
    title: "Steps",
    value: "8,432",
    target: "10k goal",
    progress: 84,
    icon: Footprints,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    id: 3,
    title: "Calories",
    value: "1,845",
    target: "2,200 goal",
    progress: 84,
    icon: Flame,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

export function HealthSummary() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Health Summary</CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10">
          <Heart className="size-5 text-destructive" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {healthMetrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex size-8 items-center justify-center rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`size-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="text-xs text-muted-foreground">{metric.target}</p>
                </div>
              </div>
              <span className="text-lg font-semibold">{metric.value}</span>
            </div>
            <Progress value={metric.progress} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
