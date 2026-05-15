"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store/index";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HealthLogs } from "./health-logs";
import { HealthOverview } from "./health-overview";
import { WorkoutsSection } from "./workouts-section";

export function HealthTracker() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");

  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const allEntries = useSelector(
    (state: RootState) => state.health.entries ?? [],
  );
  const allWorkouts = useSelector(
    (state: RootState) => state.health.workouts ?? [],
  );

  const entries = useMemo(
    () => allEntries.filter((e) => e.userEmail === currentEmail),
    [allEntries, currentEmail],
  );
  const workouts = useMemo(
    () => allWorkouts.filter((w) => w.userEmail === currentEmail),
    [allWorkouts, currentEmail],
  );

  const stats = useMemo(() => {
    const getLatest = (type: string) =>
      entries
        .filter((e) => e.type === type)
        .sort((a, b) => b.createdAt - a.createdAt)[0];

    const avgSteps = (() => {
      const stepEntries = entries.filter((e) => e.type === "steps");
      if (!stepEntries.length) return "—";
      const avg = Math.round(
        stepEntries.reduce((s, e) => s + e.value, 0) / stepEntries.length,
      );
      return avg.toLocaleString();
    })();

    const latestCalories = getLatest("calories");
    const latestSleep = getLatest("sleep");
    const now = Date.now();
    const workoutsThisWeek = workouts.filter((w) => {
      const diff = (now - w.createdAt) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;

    return {
      avgSteps,
      calories: latestCalories
        ? `${latestCalories.value.toLocaleString()} kcal`
        : "—",
      workouts: `${workoutsThisWeek} this week`,
      sleep: latestSleep ? `${latestSleep.value} hrs` : "—",
    };
  }, [entries, workouts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Health Tracker"
          description="Monitor your daily health metrics and workouts"
        />
        <Button
          onClick={() => router.push("/health/entry/add")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pb-3">
          <Stat label="Avg Steps" value={stats.avgSteps} />
          <Stat label="Calories" value={stats.calories} />
          <Stat label="Workouts" value={stats.workouts} />
          <Stat label="Sleep" value={stats.sleep} />
        </div>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
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

      {activeTab === "overview" && (
        <HealthOverview viewMode={viewMode} userEmail={currentEmail} />
      )}
      {activeTab === "logs" && <HealthLogs userEmail={currentEmail} />}
      {activeTab === "workouts" && <WorkoutsSection userEmail={currentEmail} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
