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

import "@/app/globals.css";

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
          <IconButton aria-label="Dark mode">
            <DarkModeOutlinedIcon />
          </IconButton>

          <IconButton
            aria-label="Notifications"
            className="notification-button"
          >
            <NotificationsNoneOutlinedIcon />
            <span className="notification-dot" />
          </IconButton>

          {/* Profile Avatar */}
          <IconButton
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
          >
            <MenuItem onClick={handleViewProfile}>
              <PersonOutlineIcon fontSize="small" sx={{ mr: 1 }} />
              View Profile
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              disabled={loggingOut}
              sx={{ color: "error.main" }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              {loggingOut ? "Logging out..." : "Logout"}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
