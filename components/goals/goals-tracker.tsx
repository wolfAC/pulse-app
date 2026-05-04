"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Goal, GoalStatus } from "@/lib/types/goal";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { GoalCard } from "./goal-card";
import { GoalDetailsSheet } from "./goal-details-sheet";
import { GoalDialog } from "./goal-dialog";

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Learn TypeScript",
    description:
      "Master TypeScript fundamentals and advanced patterns for better code quality.",
    progress: 65,
    priority: "high",
    status: "active",
    dueDate: "2026-06-15",
    milestones: [
      { id: "m1", title: "Complete basics course", completed: true },
      { id: "m2", title: "Build a project", completed: false },
      { id: "m3", title: "Learn advanced types", completed: false },
    ],
    tasks: [
      { id: "t1", title: "Read documentation", completed: true },
      { id: "t2", title: "Practice generics", completed: true },
      { id: "t3", title: "Build type-safe API", completed: false },
    ],
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Run a Marathon",
    description: "Train and complete a full marathon by the end of the year.",
    progress: 40,
    priority: "medium",
    status: "active",
    dueDate: "2026-11-20",
    milestones: [
      { id: "m4", title: "Run 10K", completed: true },
      { id: "m5", title: "Run half marathon", completed: false },
      { id: "m6", title: "Complete marathon", completed: false },
    ],
    tasks: [
      { id: "t4", title: "Create training schedule", completed: true },
      { id: "t5", title: "Buy running gear", completed: true },
      { id: "t6", title: "Join running club", completed: false },
    ],
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    title: "Read 24 Books",
    description: "Read 2 books per month across various genres and topics.",
    progress: 25,
    priority: "low",
    status: "active",
    dueDate: "2026-12-31",
    milestones: [
      { id: "m7", title: "Read 6 books", completed: true },
      { id: "m8", title: "Read 12 books", completed: false },
      { id: "m9", title: "Read 24 books", completed: false },
    ],
    tasks: [
      { id: "t7", title: "Create reading list", completed: true },
      { id: "t8", title: "Set daily reading time", completed: true },
      { id: "t9", title: "Join book club", completed: false },
    ],
    createdAt: "2026-01-01",
  },
  {
    id: "4",
    title: "Complete React Course",
    description:
      "Finished the advanced React patterns course with certification.",
    progress: 100,
    priority: "high",
    status: "completed",
    dueDate: "2026-03-01",
    milestones: [
      { id: "m10", title: "Complete fundamentals", completed: true },
      { id: "m11", title: "Build portfolio project", completed: true },
      { id: "m12", title: "Pass certification", completed: true },
    ],
    tasks: [
      { id: "t10", title: "Watch all videos", completed: true },
      { id: "t11", title: "Complete exercises", completed: true },
      { id: "t12", title: "Submit final project", completed: true },
    ],
    createdAt: "2025-12-01",
  },
];

type TabValue = "active" | "completed" | "all";

export function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [activeTab, setActiveTab] = useState<TabValue>("active");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredGoals = useMemo(() => {
    if (activeTab === "all") return goals;
    return goals.filter((goal) => goal.status === activeTab);
  }, [goals, activeTab]);

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (goalData.id) {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalData.id ? { ...g, ...goalData } : g)),
      );
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: goalData.title || "",
        description: goalData.description || "",
        progress: 0,
        priority: goalData.priority || "medium",
        status: "active",
        dueDate: goalData.dueDate || "",
        milestones: [],
        tasks: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setDetailsOpen(true);
  };

  const calculateProgress = (goal: Goal): number => {
    const totalItems = goal.milestones.length + goal.tasks.length;
    if (totalItems === 0) return goal.progress;
    const completedItems =
      goal.milestones.filter((m) => m.completed).length +
      goal.tasks.filter((t) => t.completed).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m,
        );
        const updatedGoal = { ...g, milestones: updatedMilestones };
        const newProgress = calculateProgress(updatedGoal);
        const newStatus: GoalStatus =
          newProgress === 100 ? "completed" : "active";
        return { ...updatedGoal, progress: newProgress, status: newStatus };
      }),
    );
    setSelectedGoal((prev) => {
      if (!prev || prev.id !== goalId) return prev;
      const updatedMilestones = prev.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m,
      );
      const updatedGoal = { ...prev, milestones: updatedMilestones };
      const newProgress = calculateProgress(updatedGoal);
      const newStatus: GoalStatus =
        newProgress === 100 ? "completed" : "active";
      return { ...updatedGoal, progress: newProgress, status: newStatus };
    });
  };

  const handleToggleTask = (goalId: string, taskId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedTasks = g.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t,
        );
        const updatedGoal = { ...g, tasks: updatedTasks };
        const newProgress = calculateProgress(updatedGoal);
        const newStatus: GoalStatus =
          newProgress === 100 ? "completed" : "active";
        return { ...updatedGoal, progress: newProgress, status: newStatus };
      }),
    );
    setSelectedGoal((prev) => {
      if (!prev || prev.id !== goalId) return prev;
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      );
      const updatedGoal = { ...prev, tasks: updatedTasks };
      const newProgress = calculateProgress(updatedGoal);
      const newStatus: GoalStatus =
        newProgress === 100 ? "completed" : "active";
      return { ...updatedGoal, progress: newProgress, status: newStatus };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Goals Tracker"
          description="Manage and track your goals progress"
        />
        <Button
          onClick={() => {
            setEditingGoal(null);
            setDialogOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="size-4" />
          Create Goal
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabValue)}
        >
          <TabsList>
            <TabsTrigger value="active">
              Active ({goals.filter((g) => g.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({goals.filter((g) => g.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({goals.length})</TabsTrigger>
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

      {filteredGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">No goals found</p>
          <Button
            variant="link"
            onClick={() => {
              setEditingGoal(null);
              setDialogOpen(true);
            }}
          >
            Create your first goal
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
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onSelect={handleSelectGoal}
            />
          ))}
        </div>
      )}

      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        goal={editingGoal}
        onSave={handleSaveGoal}
      />

      <GoalDetailsSheet
        goal={selectedGoal}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onToggleMilestone={handleToggleMilestone}
        onToggleTask={handleToggleTask}
      />
    </div>
  );
}
