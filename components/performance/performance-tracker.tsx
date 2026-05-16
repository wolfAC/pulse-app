"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review, ReviewPeriod } from "@/lib/types/performance";
import { RootState } from "@/store";
import { deleteReview } from "@/store/slices/performance";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReviewCard } from "./review-card";
import { useIsMobile } from "@/hooks/use-mobile";

type FilterType = "all" | ReviewPeriod;

export function PerformanceTracker() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();

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

  const handleEdit = (review: Review) => {
    router.push(`/performance/review/edit/${review.id}`);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteReview(id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky top section */}
      <div className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterType)}
          >
            <TabsList
              className={`h-auto bg-transparent border p-1 ${
                isMobile ? "w-full" : ""
              }`}
            >
              <TabsTrigger value="all" className="px-3 py-1.5">
                All ({reviews.length})
              </TabsTrigger>

              <TabsTrigger value="daily" className="px-3 py-1.5">
                Daily ({reviews.filter((r) => r.period === "daily").length})
              </TabsTrigger>

              <TabsTrigger value="weekly" className="px-3 py-1.5">
                Weekly ({reviews.filter((r) => r.period === "weekly").length})
              </TabsTrigger>

              <TabsTrigger value="monthly" className="px-3 py-1.5">
                Monthly ({reviews.filter((r) => r.period === "monthly").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {!isMobile && (
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "grid" | "list")}
            >
              <TabsList className="h-auto bg-transparent border p-1">
                <TabsTrigger value="grid" className="gap-1.5 px-3 py-1.5">
                  <LayoutGrid className="size-4" />
                  <span className="sr-only sm:not-sr-only">Grid</span>
                </TabsTrigger>

                <TabsTrigger value="list" className="gap-1.5 px-3 py-1.5">
                  <List className="size-4" />
                  <span className="sr-only sm:not-sr-only">List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto">
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
    </div>
  );
}
