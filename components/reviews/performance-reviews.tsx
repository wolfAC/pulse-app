"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review, ReviewPeriod } from "@/lib/types/review";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { RadialScore } from "./radial-score";
import { ReviewCard } from "./review-card";
import { ReviewDialog } from "./review-dialog";

// Sample data
const sampleReviews: Review[] = [
  {
    id: "1",
    date: "2024-01-15",
    period: "daily",
    overallScore: 85,
    metrics: {
      productivity: 90,
      quality: 85,
      communication: 80,
      learning: 85,
    },
    highlights: [
      "Completed feature implementation ahead of schedule",
      "Received positive feedback from stakeholders",
    ],
    blockers: ["Waiting on API documentation from backend team"],
    improvements: ["Could improve code review turnaround time"],
    notes: "Overall productive day with good focus time.",
  },
  {
    id: "2",
    date: "2024-01-14",
    period: "daily",
    overallScore: 72,
    metrics: {
      productivity: 70,
      quality: 75,
      communication: 70,
      learning: 73,
    },
    highlights: ["Fixed critical bug in production"],
    blockers: [
      "Multiple meeting interruptions",
      "Unclear requirements for new feature",
    ],
    improvements: [
      "Better time blocking for deep work",
      "Ask for clarification earlier",
    ],
  },
  {
    id: "3",
    date: "2024-01-08",
    period: "weekly",
    overallScore: 88,
    metrics: {
      productivity: 92,
      quality: 88,
      communication: 85,
      learning: 87,
    },
    highlights: [
      "Shipped 3 major features",
      "Led successful sprint planning",
      "Mentored junior developer",
    ],
    blockers: [],
    improvements: ["Documentation could be more thorough"],
    notes: "Excellent week with strong delivery and team collaboration.",
  },
  {
    id: "4",
    date: "2024-01-01",
    period: "monthly",
    overallScore: 82,
    metrics: {
      productivity: 85,
      quality: 82,
      communication: 78,
      learning: 83,
    },
    highlights: [
      "Completed Q4 objectives",
      "Improved test coverage by 25%",
      "Launched new dashboard feature",
    ],
    blockers: ["Resource constraints mid-month"],
    improvements: ["Cross-team communication", "Better estimation accuracy"],
    notes: "Strong month overall with room for improvement in planning.",
  },
];

type FilterType = "all" | ReviewPeriod;

export function PerformanceReviews() {
  const [reviews, setReviews] = useState(sampleReviews);
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredReviews = reviews
    .filter((r) => filter === "all" || r.period === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const averageScore =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length,
        )
      : 0;

  const trend = (() => {
    if (reviews.length < 2) return 0;
    const sorted = [...reviews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return sorted[0].overallScore - sorted[1].overallScore;
  })();
  type ReviewInput = Omit<Review, "id" | "overallScore">;
  const handleSave = (reviewData: ReviewInput) => {
    const overallScore = Math.round(
      (reviewData.metrics.productivity +
        reviewData.metrics.quality +
        reviewData.metrics.communication +
        reviewData.metrics.learning) /
        4,
    );

    if (editingReview) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...reviewData, id: editingReview.id, overallScore }
            : r,
        ),
      );
    } else {
      const newReview = {
        ...reviewData,
        id: crypto.randomUUID(),
        overallScore,
      };
      setReviews((prev) => [newReview, ...prev]);
    }

    setEditingReview(null);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Performance Reviews"
          description="Track and reflect on your work performance"
        />

        <Button
          onClick={() => {
            setEditingReview(null);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Review
        </Button>
      </div>

      {/* Stats (now free layout, not inside card) */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pb-3">
          <div className="flex items-center gap-3">
            <RadialScore score={averageScore} size="sm" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Score</p>
              <p className="text-sm font-medium">{averageScore}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TrendingUp
              className={cn(
                "h-5 w-5",
                trend > 0
                  ? "text-accent"
                  : trend < 0
                    ? "text-destructive"
                    : "text-muted-foreground",
              )}
            />
            <div>
              <p className="text-xs text-muted-foreground">Trend</p>
              <p className="text-sm font-medium">
                {trend > 0 ? "+" : ""}
                {trend}%
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-medium">{reviews.length} reviews</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-sm font-medium">
              {
                reviews.filter((r) => {
                  const d = new Date(r.date);
                  const now = new Date();
                  return (
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                  );
                }).length
              }{" "}
              reviews
            </p>
          </div>
        </div>
      </Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
            <TabsTrigger value="daily">
              Daily ({reviews.filter((r) => r.period === "daily").length})
            </TabsTrigger>
            <TabsTrigger value="weekly">
              Weekly ({reviews.filter((r) => r.period === "weekly").length})
            </TabsTrigger>
            <TabsTrigger value="monthly">
              Monthly ({reviews.filter((r) => r.period === "monthly").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-1.5"
          >
            <LayoutGrid className="size-4" />
            <span className="sr-only sm:not-sr-only">Grid</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-1.5"
          >
            <List className="size-4" />
            <span className="sr-only sm:not-sr-only">List</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">No reviews yet</p>
          <Button
            variant="link"
            onClick={() => {
              setEditingReview(null);
              setDialogOpen(true);
            }}
          >
            Add your first review
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        review={editingReview}
        onSave={handleSave}
      />
    </div>
  );
}
