"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  CheckCircle2, 
  Trophy, 
  Target, 
  Flame,
  Clock
} from "lucide-react"

const activities = [
  {
    id: 1,
    type: "achievement",
    title: "New Achievement Unlocked",
    description: "Early Bird - Completed tasks before 9 AM",
    time: "2 min ago",
    icon: Trophy,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    id: 2,
    type: "task",
    title: "Task Completed",
    description: "Review quarterly report",
    time: "15 min ago",
    icon: CheckCircle2,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 3,
    type: "goal",
    title: "Goal Progress",
    description: "Learn TypeScript - 62% complete",
    time: "1 hour ago",
    icon: Target,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 4,
    type: "streak",
    title: "Streak Maintained",
    description: "7-day productivity streak!",
    time: "2 hours ago",
    icon: Flame,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    id: 5,
    type: "focus",
    title: "Focus Session",
    description: "45-minute deep work session completed",
    time: "3 hours ago",
    icon: Clock,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
]

export function RecentActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Activity className="size-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 ${
                index !== activities.length - 1 ? "pb-4 border-b border-border" : ""
              }`}
            >
              <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${activity.bgColor}`}>
                <activity.icon className={`size-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5 py-0">
                    {activity.time}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
