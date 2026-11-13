"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import useAuth from "@/hooks/useAuth";

import "../app/globals.css";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  // Logout လုပ်ခြင်း
  const handleLogout = () => {
    logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="dashboard-shell">
      <Sidebar
        collapsed={collapsed}
        pathname={pathname}
        onToggle={() => setCollapsed((prev) => !prev)}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}
