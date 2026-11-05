"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MouseEvent } from "react";

import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import "@/app/globals.css";

type SidebarProps = {
  collapsed: boolean;
  pathname: string;
  onToggle: () => void;
  onNavigate?: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: DashboardOutlinedIcon,
  },
  {
    label: "Users",
    path: "/user",
    icon: PeopleAltOutlinedIcon,
  },
  {
    label: "Settings",
    path: "/setting",
    icon: SettingsOutlinedIcon,
  },
];

const roleSubmenu = [
  {
    label: "Roles",
    path: "/role",
    icon: AdminPanelSettingsOutlinedIcon,
  },
  {
    label: "Permissions",
    path: "/permission",
    icon: SecurityOutlinedIcon,
  },
];

export default function Sidebar({
  collapsed,
  pathname,
  onToggle,
  onNavigate,
}: SidebarProps) {
  const [rolesOpen, setRolesOpen] = useState(
    pathname.startsWith("/roles") || pathname.startsWith("/permissions"),
  );

  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

  const [loggingOut, setLoggingOut] = useState(false);

  // Sidebar width depends only on the toggle button.
  const sidebarCollapsed = collapsed;
  const profileOpen = Boolean(profileAnchor);

  useEffect(() => {
    if (pathname.startsWith("/roles") || pathname.startsWith("/permissions")) {
      setRolesOpen(true);
    }
  }, [pathname]);

  function handleProfileClick(event: MouseEvent<HTMLElement>) {
    setProfileAnchor(event.currentTarget);
  }

  function handleProfileClose() {
    setProfileAnchor(null);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    handleProfileClose();

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }

  return (
    <Box
      component="aside"
      className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      {/* Brand and collapse button */}
      <Box className="sidebar-header">
        <Box className="sidebar-brand">
          <Box className="sidebar-logo">
            <AdminPanelSettingsOutlinedIcon />
          </Box>

          {!sidebarCollapsed && (
            <Box className="sidebar-brand-info">
              <Typography className="sidebar-brand-subtitle">Menu</Typography>
            </Box>
          )}
        </Box>

        <Tooltip
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <KeyboardDoubleArrowRightIcon />
            ) : (
              <KeyboardDoubleArrowLeftIcon />
            )}
          </Button>
        </Tooltip>
      </Box>

      {/* Main menu */}
      <Box component="nav" className="sidebar-nav">
        {menuItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Tooltip
              key={item.path}
              title={sidebarCollapsed ? item.label : ""}
              placement="right"
            >
              <Box
                component={Link}
                href={item.path}
                onClick={onNavigate}
                className={`sidebar-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="sidebar-icon" />

                {!sidebarCollapsed && (
                  <Typography className="sidebar-link-label">
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}

        {/* Roles and Permissions */}
        <Tooltip
          title={sidebarCollapsed ? "Roles & Permissions" : ""}
          placement="right"
        >
          <Box
            component="button"
            type="button"
            className={`sidebar-link sidebar-menu-button ${
              rolesOpen || roleSubmenu.some((item) => isActive(item.path))
                ? "active"
                : ""
            }`}
            onClick={() => {
              if (sidebarCollapsed) {
                onToggle();
              } else {
                setRolesOpen((previous) => !previous);
              }
            }}
            aria-expanded={rolesOpen}
          >
            <AdminPanelSettingsOutlinedIcon className="sidebar-icon" />

            {!sidebarCollapsed && (
              <>
                <Typography className="sidebar-link-label">
                  Roles &amp; Permissions
                </Typography>

                <Box className="sidebar-menu-arrow">
                  {rolesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </>
            )}
          </Box>
        </Tooltip>

        <Collapse
          in={rolesOpen && !sidebarCollapsed}
          timeout="auto"
          unmountOnExit
        >
          <Box className="sidebar-submenu">
            {roleSubmenu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Box
                  key={item.path}
                  component={Link}
                  href={item.path}
                  onClick={onNavigate}
                  className={`sidebar-link sidebar-sublink ${
                    active ? "active" : ""
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="sidebar-icon" />

                  <Typography className="sidebar-link-label">
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Collapse>

        {/* Settings */}
        {menuItems.slice(2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Tooltip
              key={item.path}
              title={sidebarCollapsed ? item.label : ""}
              placement="right"
            >
              <Box
                component={Link}
                href={item.path}
                onClick={onNavigate}
                className={`sidebar-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="sidebar-icon" />

                {!sidebarCollapsed && (
                  <Typography className="sidebar-link-label">
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Profile and logout */}
      <Box className="sidebar-bottom">
        <Divider className="sidebar-footer-divider" />

        <Tooltip
          title={sidebarCollapsed ? "Admin profile" : ""}
          placement="right"
        >
          <Button
            className="sidebar-profile-button"
            onClick={handleProfileClick}
            aria-label="Open profile menu"
          >
            <Avatar className="sidebar-profile-avatar">A</Avatar>

            {!sidebarCollapsed && (
              <>
                <Box className="sidebar-profile-info">
                  <Typography className="sidebar-profile-name">
                    Admin
                  </Typography>

                  <Typography className="sidebar-profile-role">
                    Administrator
                  </Typography>
                </Box>

                <ExpandMoreIcon className="sidebar-profile-arrow" />
              </>
            )}
          </Button>
        </Tooltip>

        <Menu
          anchorEl={profileAnchor}
          open={profileOpen}
          onClose={handleProfileClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              className: "sidebar-profile-menu",
            },
          }}
        >
          <MenuItem
            component={Link}
            href="/profile"
            onClick={() => {
              handleProfileClose();
              onNavigate?.();
            }}
          >
            <PersonOutlineOutlinedIcon fontSize="small" />
            <Typography>View Profile</Typography>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            disabled={loggingOut}
            className="sidebar-logout-item"
          >
            <LogoutOutlinedIcon fontSize="small" />
            <Typography>{loggingOut ? "Logging out..." : "Logout"}</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
