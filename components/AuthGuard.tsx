"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import DesktopSidebar from "@/components/DesktopSidebar";
import BottomNav from "@/components/BottomNav";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { student, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (!loading && !student && !isLoginPage) {
      router.replace("/login");
    }
  }, [student, loading, isLoginPage, router]);

  // While checking localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Login / signup page — clean full-screen, no sidebar, no bottom nav
  if (!student || isLoginPage) {
    return <>{children}</>;
  }

  // Authenticated — full app layout
  return (
    <>
      <DesktopSidebar />
      <div className="sidebar-offset min-h-screen pb-28 lg:pb-0">
        {children}
      </div>
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </>
  );
}
