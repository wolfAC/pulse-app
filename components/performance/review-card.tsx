"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Zap,
  Award,
  MessageSquare,
  BookOpen,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Review, periodLabels, metricLabels } from "@/lib/types/performance";
import { RadialScore } from "./radial-score";
import { cn, formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

const metricIcons = {
  productivity: Zap,
  quality: Award,
  communication: MessageSquare,
  learning: BookOpen,
};

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatReviewDate = (dateValue: number) => {
    return formatDate(dateValue, { includeWeekday: true, includeYear: true });
  };

  const periodStyles: Record<
    string,
    {
      period: string;
      score: string;
      indicator: string;
      radialColor: string;
      progressColor: string;
    }
  > = {
    daily: {
      period: "bg-primary/20 text-primary border-primary/30",
      score: "bg-primary/10 text-primary/80 border-primary/20",
      indicator: "from-primary via-primary/70 to-primary/30",
      radialColor: "text-primary stroke-primary",
      progressColor: "[&>div]:bg-primary",
    },
    weekly: {
      period: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      score: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
      indicator: "from-emerald-500 via-emerald-400 to-emerald-500/50",
      radialColor: "text-emerald-400 stroke-emerald-400",
      progressColor: "[&>div]:bg-emerald-500",
    },
    monthly: {
      period: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      score: "bg-purple-500/10 text-purple-300 border-purple-400/30",
      indicator: "from-purple-500 via-purple-400 to-purple-500/50",
      radialColor: "text-purple-400 stroke-purple-400",
      progressColor: "[&>div]:bg-purple-500",
    },
  };

  const styles = periodStyles[review.period] ?? {
    period: "bg-secondary text-secondary-foreground border-border",
    score: "bg-secondary text-secondary-foreground border-border",
    indicator: "from-primary via-accent to-primary/50",
    radialColor: "text-primary stroke-primary",
    progressColor: "[&>div]:bg-primary",
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50">
      {/* Timeline indicator */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b",
          styles.indicator,
        )}
      />

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3 pl-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <RadialScore
                score={review.overallScore}
                size="md"
                color={styles.radialColor}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", styles.period)}
                  >
                    {periodLabels[review.period]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", styles.score)}
                  >
                    Score: {review.overallScore}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatReviewDate(review.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(review)}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span className="sr-only">Edit review</span>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete review</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete review?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This {periodLabels[review.period].toLowerCase()} review
                      from {formatReviewDate(review.createdAt)} will be
                      permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(review.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pl-1">
            {(
              Object.keys(review.metrics) as Array<keyof typeof review.metrics>
            ).map((key) => {
              const Icon = metricIcons[key];
              const value = review.metrics[key];
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{metricLabels[key]}</span>
                  </div>
                  <Progress
                    value={value}
                    className={cn("h-1.5", styles.progressColor)}
                  />
                  <span className="text-xs font-medium">{value}%</span>
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 pl-5 space-y-4">
            {/* Highlights */}
            {review.highlights.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-accent">
                  <Lightbulb className="h-4 w-4" />
                  Highlights
                </div>
                <ul className="space-y-1 pl-6">
                  {review.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground list-disc"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Blockers */}
            {review.blockers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Blockers
                </div>
                <ul className="space-y-1 pl-6">
                  {review.blockers.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground list-disc"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {review.improvements.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <TrendingUp className="h-4 w-4" />
                  Areas for Improvement
                </div>
                <ul className="space-y-1 pl-6">
                  {review.improvements.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground list-disc"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {review.notes && (
              <div className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                {review.notes}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
