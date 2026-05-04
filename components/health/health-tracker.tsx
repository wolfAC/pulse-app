"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useState } from "react";
import { AddEntryDialog } from "./add-entry-dialog";
import { HealthLogs } from "./health-logs";
import { HealthOverview } from "./health-overview";
import { WorkoutsSection } from "./workouts-section";

export function HealthTracker() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Health Tracker"
          description="Monitor your daily health metrics and workouts"
        />

        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Stats */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 pb-3">
          <Stat label="Avg Steps" value="8,200" />
          <Stat label="Calories" value="2,100 kcal" />
          <Stat label="Workouts" value="4 this week" />
          <Stat label="Sleep" value="7.2 hrs" />
        </div>
      </Card>

      {/* Tabs + View toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* View toggle (optional) */}
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

      {activeTab === "overview" && <HealthOverview viewMode={viewMode} />}
      {activeTab === "logs" && <HealthLogs />}
      {activeTab === "workouts" && <WorkoutsSection />}

      <AddEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
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
