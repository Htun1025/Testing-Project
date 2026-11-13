"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
import LanguageSwitcher from "@/components/LanguageSwitcher";
import useAuth from "@/hooks/useAuth";

import "@/app/globals.css";

type DashboardHeaderProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  onMenuClick?: () => void;
  showProfile?: boolean;
  showLanguageOnly?: boolean;
};

export default function DashboardHeader({
  showProfile = true,
  showLanguageOnly = false,
}: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const t = useTranslations("Common");

  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewProfile = () => {
    handleClose();
    router.push("/profile");
  };

  const handleLogout = () => {
    if (loggingOut) return;

    setLoggingOut(true);
    handleClose();

    try {
      logout();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  // Login page တွင် Language Switcher တစ်ခုပဲ ပြမယ်
  if (showLanguageOnly) {
    return (
      <AppBar position="sticky" elevation={0} className="topbar">
        <Toolbar className="topbar-toolbar">
          <Box className="topbar-actions">
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="sticky" elevation={0} className="topbar">
      <Toolbar className="topbar-toolbar">
        <Box className="topbar-actions">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <IconButton
            className="topbar-icon-button"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? t("switchToDarkMode") : t("switchToLightMode")
            }
            title={theme === "light" ? t("darkMode") : t("lightMode")}
          >
            {theme === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          {/* Notifications */}
          {showProfile && (
            <IconButton
              aria-label={t("notifications")}
              className="topbar-icon-button notification-button"
            >
              <NotificationsNoneOutlinedIcon />
              <span className="notification-dot" />
            </IconButton>
          )}

          {/* Profile Avatar */}
          {showProfile && (
            <>
              <IconButton
                className="topbar-profile-trigger"
                onClick={handleAvatarClick}
                aria-label={t("openProfileMenu")}
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
                <MenuItem
                  onClick={handleViewProfile}
                  className="topbar-menu-item"
                >
                  <PersonOutlineIcon className="topbar-menu-icon" />
                  {t("viewProfile")}
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="topbar-menu-item topbar-logout-item"
                >
                  <LogoutIcon className="topbar-menu-icon" />
                  {loggingOut ? t("loggingOut") : t("logout")}
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
