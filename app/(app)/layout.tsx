import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNavbar />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="container mx-auto space-y-6 p-4 lg:p-6">
            {children}
          </div>
        </main>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}
