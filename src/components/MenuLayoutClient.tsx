"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

import "../app/globals.css";

type MenuLayoutClientProps = {
  children: React.ReactNode;
};

export default function MenuLayoutClient({ children }: MenuLayoutClientProps) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  // Expand temporarily when hovering over a collapsed sidebar.
  const sidebarCollapsed = collapsed && !hovered;

  function toggleSidebar() {
    setCollapsed((previous) => !previous);
    setHovered(false);
  }

  return (
    <Box className="app-layout">
      <Box
        className={`sidebar-hover-area ${
          !collapsed ? "sidebar-pinned-open" : ""
        }`}
        onMouseEnter={() => {
          if (collapsed) setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          pathname={pathname}
          onToggle={toggleSidebar}
        />
      </Box>

      <Box component="main" className="main-content">
        <DashboardHeader
          search={headerSearch}
          onSearchChange={setHeaderSearch}
          onMenuClick={toggleSidebar}
        />

        <Box className="menu-page-content">{children}</Box>
      </Box>
    </Box>
  );
}
