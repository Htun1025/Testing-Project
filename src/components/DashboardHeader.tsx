"use client";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
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

          <Avatar className="profile-avatar">A</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
