import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { StoreProvider } from "@/components/providers/store";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

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
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <StoreProvider>
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
        </StoreProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
