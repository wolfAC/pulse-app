"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap } from "lucide-react"

export function ProductivityScoreCard() {
  const score = 87
  const trend = +12
  const trendPositive = trend > 0

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Productivity Score</CardTitle>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Zap className="size-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">{score}</span>
          <span className="text-lg text-muted-foreground">/100</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className={`${trendPositive ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'} gap-1`}
          >
            <TrendingUp className={`size-3 ${!trendPositive && 'rotate-180'}`} />
            {trendPositive ? '+' : ''}{trend}%
          </Badge>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          You&apos;re performing better than 85% of users
        </p>
      </CardContent>
    </Card>
  )
}
