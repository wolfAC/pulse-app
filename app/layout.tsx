import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Productivity Dashboard",
  description: "Track your productivity, health, and goals in one place",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <TopNavbar />
            <main className="flex-1 overflow-auto pb-20 md:pb-0">
              <div className="container mx-auto p-4 lg:p-6 space-y-6">
                {children}
              </div>
            </main>
          </SidebarInset>
          <BottomNav />
        </SidebarProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
