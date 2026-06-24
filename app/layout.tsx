import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "GrammarFeed — AFCAT English",
  description: "Learn all 100 English grammar rules for AFCAT exam",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "GrammarFeed" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full" style={{ background: "#f0f4ff" }}>
        <AuthProvider>
          {/* Desktop sidebar — hidden on mobile */}
          <DesktopSidebar />

          {/* Main content area */}
          <div className="sidebar-offset min-h-screen pb-20 md:pb-0">
            {children}
          </div>

          {/* Bottom nav — hidden on desktop */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
