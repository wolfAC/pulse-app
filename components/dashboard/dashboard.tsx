import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { ProductivityScoreCard } from "@/components/dashboard/productivity-score-card";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { PageHeader } from "@/components/ui/page-header";
import { FinanceScoreCard } from "./finance-score-card";
import { SpendingTrendChart } from "./spending-trend-chart";

export function Dashboard() {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Track your productivity, health, and goals all in one place."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Productivity Score - Takes 1 column */}
        <ProductivityScoreCard />

        {/* Goals Progress - Takes 1 column on md, 2 on lg */}
        <div className="md:col-span-1 lg:col-span-2">
          <GoalsProgress />
        </div>

        {/* Health Summary - Takes 1 column */}
        <HealthSummary />

        {/* Weekly Activity Chart - Takes full width on mobile, 2 columns on lg */}
        <WeeklyActivityChart />

        <FinanceScoreCard />

        <SpendingTrendChart />

        {/* Recent Activity Feed - Takes 1 column */}
        {/* <RecentActivityFeed /> */}
      </div>
    </>
  );
}
