import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { GoalsProgress } from "@/components/dashboard/goals-progress";
import { HealthSummary } from "@/components/dashboard/health-summary";
import { ProductivityScoreCard } from "@/components/dashboard/productivity-score-card";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { FormModalDemo } from "@/components/demos/form-modal-demo";
import { GoalsTracker } from "@/components/goals/goals-tracker";
import { HealthTracker } from "@/components/health/health-tracker";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { NavProvider } from "@/components/navigation/nav-context";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { PerformanceReviews } from "@/components/reviews/performance-reviews";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if onboarding has been completed
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    setShowOnboarding(!hasCompletedOnboarding);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
  };

  // Show nothing while checking localStorage to avoid hydration mismatch
  if (showOnboarding === null) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <NavProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNavbar />
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            <div className="container mx-auto p-4 lg:p-6 space-y-6">
              {/* Dashboard Section */}
              <section
                id="section-dashboard"
                className="scroll-mt-20 space-y-6"
              >
                {/* Page Header */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Track your productivity, health, and goals all in one place.
                  </p>
                </div>

                {/* Main Grid */}
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

                  {/* Recent Activity Feed - Takes 1 column */}
                  <RecentActivityFeed />
                </div>
              </section>

              {/* Goals Section */}
              <section id="section-goals" className="scroll-mt-20">
                <GoalsTracker />
              </section>

              {/* Performance Section */}
              <section id="section-performance" className="scroll-mt-20">
                <PerformanceReviews />
              </section>

              {/* Health Section */}
              <section id="section-health" className="scroll-mt-20">
                <HealthTracker />
              </section>

              {/* Form Modal Demo */}
              <FormModalDemo />
            </div>
          </main>
        </SidebarInset>
        <BottomNav />
      </SidebarProvider>
    </NavProvider>
  );
}
