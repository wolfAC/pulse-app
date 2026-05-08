"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review, ReviewPeriod } from "@/lib/types/review";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  updateReview,
  deleteReview,
} from "@/store/slices/performance";
import { RadialScore } from "./radial-score";
import { ReviewCard } from "./review-card";
import { ReviewDialog } from "./review-dialog";
import { RootState } from "@/store";

type FilterType = "all" | ReviewPeriod;

export function PerformanceReviews() {
  const dispatch = useDispatch();
  const reviews = useSelector((state: RootState) => state.performance.reviews);

  const [filter, setFilter] = useState<FilterType>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredReviews = reviews
    .filter((r) => filter === "all" || r.period === filter)
    .slice() // avoid mutating the Redux state array
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
      // Update existing review via Redux action
      dispatch(
        updateReview({
          ...reviewData,
          id: editingReview.id,
          overallScore,
        }),
      );
    } else {
      // Add new review via Redux action
      dispatch(
        addReview({
          ...reviewData,
          id: crypto.randomUUID(),
          overallScore,
        }),
      );
    }

    setEditingReview(null);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // Delete review via Redux action
    dispatch(deleteReview(id));
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

      {/* Stats */}
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
        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
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

        {/* View Mode Toggle */}
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
