"use client";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { GlobalSearch } from "@/components/search/global-search";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div
        className="h-screen transition-[filter] duration-200"
        style={searchOpen ? { filter: "blur(6px) brightness(0.5)" } : undefined}
      >
        <SidebarProvider className="h-full">
          <AppSidebar />
          <SidebarInset className="flex flex-col h-full overflow-hidden">
            <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
            <main className="flex-1 overflow-hidden pb-20 md:pb-0">
              <div className="h-full container mx-auto p-4 lg:p-6">
                {children}
              </div>
            </main>
          </SidebarInset>
          <BottomNav />
        </SidebarProvider>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
