"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import LoadingScreen from "@/components/LoadingScreen";
import useAuth from "@/hooks/useAuth";

import "../app/globals.css";

type MenuLayoutClientProps = {
  children: React.ReactNode;
};

export default function MenuLayoutClient({ children }: MenuLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  const sidebarExpanded = pinned || hovered;

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  function toggleSidebar() {
    setPinned((previous) => !previous);
    setHovered(false);
  }

  // Logout function
  function handleLogout() {
    logout();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      className={`app-layout ${
        sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {/* Fixed Sidebar */}
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
          onLogout={handleLogout}
        />
      </Box>

      {/* Scrollable Main UI */}
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
