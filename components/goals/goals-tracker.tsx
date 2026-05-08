"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Goal, GoalStatus } from "@/lib/types/goal";
import { RootState } from "@/store";
import { addGoal, deleteGoal, updateGoal } from "@/store/slices/goals";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoalCard } from "./goal-card";
import { GoalDetailsSheet } from "./goal-details-sheet";
import { GoalDialog } from "./goal-dialog";

type TabValue = "active" | "completed" | "all";

export function GoalsTracker() {
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.goals.goals);
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

  const calculateProgress = (goal: Goal): number => {
    const totalItems = goal.milestones.length + goal.tasks.length;
    if (totalItems === 0) return goal.progress;
    const completedItems =
      goal.milestones.filter((m) => m.completed).length +
      goal.tasks.filter((t) => t.completed).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (goalData.id) {
      // Edit existing — merge with the current goal from Redux
      const existing = goals.find((g) => g.id === goalData.id);
      if (existing) {
        dispatch(updateGoal({ ...existing, ...goalData } as Goal));
      }
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
      dispatch(addGoal(newGoal));
    }
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    dispatch(deleteGoal(id));
  };
  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setDetailsOpen(true);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m,
    );
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    const newProgress = calculateProgress(updatedGoal);
    const newStatus: GoalStatus = newProgress === 100 ? "completed" : "active";
    const finalGoal = {
      ...updatedGoal,
      progress: newProgress,
      status: newStatus,
    };

    dispatch(updateGoal(finalGoal));

    // Keep the details sheet in sync
    setSelectedGoal((prev) => (prev?.id === goalId ? finalGoal : prev));
  };

  const handleToggleTask = (goalId: string, taskId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedTasks = goal.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t,
    );
    const updatedGoal = { ...goal, tasks: updatedTasks };
    const newProgress = calculateProgress(updatedGoal);
    const newStatus: GoalStatus = newProgress === 100 ? "completed" : "active";
    const finalGoal = {
      ...updatedGoal,
      progress: newProgress,
      status: newStatus,
    };

    dispatch(updateGoal(finalGoal));

    setSelectedGoal((prev) => (prev?.id === goalId ? finalGoal : prev));
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
