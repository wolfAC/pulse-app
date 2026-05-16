"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store/index";
import { LayoutGrid, List, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { HealthLogs } from "./health-logs";
import { HealthOverview } from "./health-overview";
import { WorkoutsSection } from "./workouts-section";
import { useIsMobile } from "@/hooks/use-mobile";

export function HealthTracker() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const isMobile = useIsMobile();

  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sticky top section */}
      <div className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className={`h-auto bg-transparent border p-1 ${
                isMobile ? "w-full" : ""
              }`}
            >
              <TabsTrigger value="overview" className="px-3 py-1.5">
                Overview
              </TabsTrigger>

              <TabsTrigger value="logs" className="px-3 py-1.5">
                Logs
              </TabsTrigger>

              <TabsTrigger value="workouts" className="px-3 py-1.5">
                Workouts
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "overview" && (
          <HealthOverview viewMode={viewMode} userEmail={currentEmail} />
        )}
        {activeTab === "logs" && <HealthLogs userEmail={currentEmail} />}
        {activeTab === "workouts" && (
          <WorkoutsSection userEmail={currentEmail} />
        )}
      </div>
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
