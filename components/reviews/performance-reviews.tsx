"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ClipboardList, TrendingUp, Calendar } from "lucide-react"
import { Review, ReviewPeriod } from "@/lib/types/review"
import { ReviewCard } from "./review-card"
import { ReviewDialog } from "./review-dialog"
import { RadialScore } from "./radial-score"
import { cn } from "@/lib/utils"

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
    improvements: [
      "Cross-team communication",
      "Better estimation accuracy",
    ],
    notes: "Strong month overall with room for improvement in planning.",
  },
]

type FilterType = "all" | ReviewPeriod

export function PerformanceReviews() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [filter, setFilter] = useState<FilterType>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)

  const filteredReviews = reviews
    .filter((r) => filter === "all" || r.period === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const averageScore =
    reviews.length > 0
      ? Math.round(reviews.reduce((sum, r) => sum + r.overallScore, 0) / reviews.length)
      : 0

  const recentTrend = () => {
    if (reviews.length < 2) return 0
    const sorted = [...reviews].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return sorted[0].overallScore - sorted[1].overallScore
  }

  const trend = recentTrend()

  const handleSave = (
    reviewData: Omit<Review, "id" | "overallScore">
  ) => {
    const overallScore = Math.round(
      (reviewData.metrics.productivity +
        reviewData.metrics.quality +
        reviewData.metrics.communication +
        reviewData.metrics.learning) /
        4
    )

    if (editingReview) {
      setReviews(
        reviews.map((r) =>
          r.id === editingReview.id
            ? { ...reviewData, id: editingReview.id, overallScore }
            : r
        )
      )
    } else {
      const newReview: Review = {
        ...reviewData,
        id: crypto.randomUUID(),
        overallScore,
      }
      setReviews([newReview, ...reviews])
    }
    setEditingReview(null)
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id))
  }

  const handleAddNew = () => {
    setEditingReview(null)
    setDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Performance Reviews</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track and reflect on your work performance
              </p>
            </div>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Review
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <RadialScore score={averageScore} size="sm" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Score</p>
              <p className="text-sm font-medium">{averageScore}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <TrendingUp
                className={cn(
                  "h-5 w-5",
                  trend > 0 ? "text-accent" : trend < 0 ? "text-destructive" : "text-muted-foreground"
                )}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trend</p>
              <p className="text-sm font-medium">
                {trend > 0 ? "+" : ""}
                {trend}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-medium">{reviews.length} reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-sm font-medium">
                {
                  reviews.filter((r) => {
                    const reviewDate = new Date(r.date)
                    const now = new Date()
                    return (
                      reviewDate.getMonth() === now.getMonth() &&
                      reviewDate.getFullYear() === now.getFullYear()
                    )
                  }).length
                }{" "}
                reviews
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as FilterType)}
          className="mt-4"
        >
          <TabsList>
            <TabsTrigger value="all">
              All ({reviews.length})
            </TabsTrigger>
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
      </CardHeader>

      <CardContent>
        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Start tracking your performance by adding your first review.
            </p>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Review
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
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
      </CardContent>

      <ReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        review={editingReview}
        onSave={handleSave}
      />
    </Card>
  )
}
