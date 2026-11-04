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

  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  const sidebarExpanded = pinned || hovered;

  function toggleSidebar() {
    setPinned((previous) => !previous);
    setHovered(false);
  }

  return (
    <Box
      className={`app-layout ${
        sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {/* Sidebar */}
      <Box
        className="sidebar-hover-area"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          if (!pinned) {
            setHovered(false);
          }
        }}
      >
        <Sidebar
          collapsed={!sidebarExpanded}
          pathname={pathname}
          onToggle={toggleSidebar}
        />
      </Box>

      {/* Main UI */}
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
