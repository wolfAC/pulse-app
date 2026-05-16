import { StoreProvider } from "@/components/providers/store";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Pulse",
  description: "Track your productivity, health, and goals in one place",
  metadataBase: new URL("https://pulse-app-bice.vercel.app/"),
  openGraph: {
    title: "Pulse",
    description: "Track your productivity, health, and goals in one place",
    url: "https://pulse-app-bice.vercel.app/",
    siteName: "Pulse",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulse",
    description: "Track your productivity, health, and goals in one place",
    images: ["/opengraph-image.png"],
  },
  // remove the manual icons block — Next.js picks up icon.tsx automatically
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <StoreProvider>
          <AuthProvider>{children}</AuthProvider>
        </StoreProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
