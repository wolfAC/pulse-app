"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Goal } from "@/lib/types/goal";
import { RootState } from "@/store/index";
import { deleteGoal } from "@/store/slices/goals";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";
import { GoalCard } from "./goal-card";

type TabValue = "active" | "completed" | "all";

export function GoalsTracker() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allGoals = useSelector((state: RootState) => state.goals.goals ?? []);

  const goals = useMemo(
    () => allGoals.filter((g) => g.userEmail === currentEmail),
    [allGoals, currentEmail],
  );

  const [activeTab, setActiveTab] = useState<TabValue>("active");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredGoals = useMemo(() => {
    if (activeTab === "all") return goals;
    return goals.filter((goal) => goal.status === activeTab);
  }, [goals, activeTab]);

  const handleEditGoal = (goal: Goal) => {
    router.push(`/goals/goal/edit/${goal.id}`);
  };

  const handleDeleteGoal = (id: string) => {
    dispatch(deleteGoal(id));
  };

  const handleSelectGoal = (goal: Goal) => {
    router.push(`/goals/goal/edit/${goal.id}`);
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
            router.push("/goals/goal/add");
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
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No goals found</p>
            <Button
              variant="link"
              onClick={() => {
                router.push("/goals/goal/add");
              }}
            >
              Create your first goal
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
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
