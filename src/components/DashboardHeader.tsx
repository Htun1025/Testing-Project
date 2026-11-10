"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

import { useTheme } from "./ThemeProvider";

type DashboardHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
};

export default function DashboardHeader({
  search,
  onSearchChange,
  onMenuClick,
}: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // View Profile
  const handleViewProfile = () => {
    handleClose();
    router.push("/profile");
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      handleClose();

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  return (
    <AppBar position="sticky" elevation={0} className="topbar">
      <Toolbar className="topbar-toolbar">
        <Box className="topbar-actions">
          {/* Theme Toggle */}
          <IconButton
            className="topbar-icon-button"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            title={theme === "light" ? "Dark Mode" : "Light Mode"}
          >
            {theme === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          {/* Notifications */}
          <IconButton
            aria-label="Notifications"
            className="topbar-icon-button notification-button"
          >
            <NotificationsNoneOutlinedIcon />
            <span className="notification-dot" />
          </IconButton>

          {/* Profile Avatar */}
          <IconButton
            className="topbar-profile-trigger"
            onClick={handleAvatarClick}
            aria-label="Open profile menu"
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar className="profile-avatar">A</Avatar>
          </IconButton>

          {/* Profile Menu */}
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                className: "topbar-profile-menu",
              },
            }}
          >
            <MenuItem onClick={handleViewProfile} className="topbar-menu-item">
              <PersonOutlineIcon className="topbar-menu-icon" />
              View Profile
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              disabled={loggingOut}
              className="topbar-menu-item topbar-logout-item"
            >
              <LogoutIcon className="topbar-menu-icon" />
              {loggingOut ? "Logging out..." : "Logout"}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
