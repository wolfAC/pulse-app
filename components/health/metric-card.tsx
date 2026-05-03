"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  target: string
  progress: number
  trend: number
  icon: LucideIcon
  color: string
  bgColor: string
}

export function MetricCard({
  title,
  value,
  target,
  progress,
  trend,
  icon: Icon,
  color,
  bgColor,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="size-3" />
    if (trend < 0) return <TrendingDown className="size-3" />
    return <Minus className="size-3" />
  }

  const getTrendColor = () => {
    if (trend > 0) return "text-emerald-500"
    if (trend < 0) return "text-red-500"
    return "text-muted-foreground"
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("flex size-12 items-center justify-center rounded-xl", bgColor)}>
            <Icon className={cn("size-6", color)} />
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(trend)}%</span>
          </div>
        </div>
        
        <div className="space-y-1 mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{target}</p>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
