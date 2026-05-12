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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
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

  const getPeriodColor = (period: string) => {
    switch (period) {
      case "daily":
        return "bg-primary/20 text-primary border-primary/30";
      case "weekly":
        return "bg-accent/20 text-accent border-accent/30";
      case "monthly":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-accent/20 text-accent border-accent/30";
    if (score >= 60) return "bg-primary/20 text-primary border-primary/30";
    if (score >= 40)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50">
      {/* Timeline indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-accent to-primary/50" />

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3 pl-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <RadialScore score={review.overallScore} size="md" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getPeriodColor(review.period))}
                  >
                    {periodLabels[review.period]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      getScoreBadgeColor(review.overallScore),
                    )}
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
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(review)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(review.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <Progress value={value} className="h-1.5" />
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
