"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMemo } from "react";

export function ProductivityScoreCard() {
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allReviews = useSelector(
    (state: RootState) => state.performance.reviews ?? [],
  );
  const reviews = useMemo(
    () => allReviews.filter((r) => r.userEmail === currentEmail),
    [allReviews, currentEmail],
  );

  const latest = reviews[0];
  const previous = reviews[1];
  const score = latest?.overallScore ?? 0;
  const trend = previous
    ? Math.round(
        ((score - previous.overallScore) / previous.overallScore) * 100,
      )
    : 0;
  const trendPositive = trend >= 0;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Productivity Score
        </CardTitle>
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
            className={`${trendPositive ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"} gap-1`}
          >
            <TrendingUp
              className={`size-3 ${!trendPositive && "rotate-180"}`}
            />
            {trendPositive ? "+" : ""}
            {trend}%
          </Badge>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {latest?.notes ?? "No notes available."}
        </p>
      </CardContent>
    </Card>
  );
}
