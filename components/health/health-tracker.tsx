"use client";

import { Button } from "@/components/ui/button";
import { NavTabs } from "@/components/ui/nav-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { ViewToggle } from "@/components/ui/view-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { RootState } from "@/store/index";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { HealthLogs } from "./health-logs";
import { HealthOverview } from "./health-overview";
import { WorkoutsSection } from "./workouts-section";

export function HealthTracker() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
          <NavTabs
            value={activeTab}
            onValueChange={setActiveTab}
            tabs={[
              { value: "overview", label: "Overview" },
              { value: "logs", label: "Logs" },
              { value: "workouts", label: "Workouts" },
            ]}
          />

          {!isMobile && (
            <ViewToggle value={viewMode} onValueChange={setViewMode} />
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
