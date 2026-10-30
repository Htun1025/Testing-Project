"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "../app/globals.css";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="dashboard-shell">
      <Sidebar
        collapsed={collapsed}
        pathname={pathname}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <main className="dashboard-main">
        <div className="main-content">{children}</div>
      </main>
    </div>
  );
}
