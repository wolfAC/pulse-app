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
      {/* Everything inside here gets blurred when search opens */}
      <div
        className="transition-[filter] duration-200"
        style={searchOpen ? { filter: "blur(6px) brightness(0.5)" } : undefined}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TopNavbar onSearchOpen={() => setSearchOpen(true)} />
            <main className="flex-1 overflow-auto pb-20 md:pb-0">
              <div className="container mx-auto p-4 lg:p-6 space-y-">
                {children}
              </div>
            </main>
          </SidebarInset>
          <BottomNav />
        </SidebarProvider>
      </div>

      {/* Outside the blur div — stays sharp above everything */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
