"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review, ReviewPeriod } from "@/lib/types/performance";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, Plus, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { deleteReview } from "@/store/slices/performance";
import { RadialScore } from "./radial-score";
import { ReviewCard } from "./review-card";
import { RootState } from "@/store";

type FilterType = "all" | ReviewPeriod;

export function PerformanceTracker() {
  const dispatch = useDispatch();
  const router = useRouter();

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

  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredReviews = useMemo(
    () =>
      reviews
        .filter((r) => filter === "all" || r.period === filter)
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt),
    [reviews, filter],
  );

  const averageScore =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length,
        )
      : 0;

  const trend = (() => {
    if (reviews.length < 2) return 0;
    const sorted = [...reviews].sort((a, b) => b.createdAt - a.createdAt);
    return sorted[0].overallScore - sorted[1].overallScore;
  })();

  const handleEdit = (review: Review) => {
    router.push(`/performance/review/edit/${review.id}`);
  };

  const handleDelete = (id: string) => {
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
          onClick={() => router.push("/performance/review/add")}
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
                  const d = new Date(r.createdAt);
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

      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No reviews found</p>
            <Button
              variant="link"
              onClick={() => router.push("/performance/review/add")}
            >
              Create your first review
            </Button>
          </CardContent>
        </Card>
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
    </div>
  );
}
