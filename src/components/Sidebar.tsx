"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MouseEvent } from "react";

import { useTranslations } from "next-intl";

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
  onLogout: () => void;
};

const menuItems = [
  {
    key: "dashboard",
    path: "/dashboard",
    icon: DashboardOutlinedIcon,
  },
  {
    key: "users",
    path: "/user",
    icon: PeopleAltOutlinedIcon,
  },
  {
    key: "settings",
    path: "/setting",
    icon: SettingsOutlinedIcon,
  },
];

const roleSubmenu = [
  {
    key: "roles",
    path: "/role",
    icon: AdminPanelSettingsOutlinedIcon,
  },
  {
    key: "permissions",
    path: "/permission",
    icon: SecurityOutlinedIcon,
  },
];

export default function Sidebar({
  collapsed,
  pathname,
  onToggle,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const t = useTranslations("Sidebar");
  const common = useTranslations("Common");

  const [rolesOpen, setRolesOpen] = useState(
    pathname.startsWith("/role") || pathname.startsWith("/permission"),
  );

  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

  const sidebarCollapsed = collapsed;
  const profileOpen = Boolean(profileAnchor);

  useEffect(() => {
    if (pathname.startsWith("/role") || pathname.startsWith("/permission")) {
      setRolesOpen(true);
    }
  }, [pathname]);

  function handleProfileClick(event: MouseEvent<HTMLElement>) {
    setProfileAnchor(event.currentTarget);
  }

  function handleProfileClose() {
    setProfileAnchor(null);
  }

  function handleLogout() {
    handleProfileClose();
    onLogout();
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
              <Typography className="sidebar-brand-subtitle">
                {t("menu")}
              </Typography>
            </Box>
          )}
        </Box>

        <Tooltip
          title={
            sidebarCollapsed
              ? common("expandSidebar")
              : common("collapseSidebar")
          }
        >
          <Button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={common("toggleSidebar")}
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
              title={sidebarCollapsed ? t(item.key) : ""}
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
                    {t(item.key)}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}

        {/* Roles and Permissions */}
        <Tooltip
          title={sidebarCollapsed ? t("rolesPermissions") : ""}
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
                  {t("rolesPermissions")}
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
                    {t(item.key)}
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
              title={sidebarCollapsed ? t(item.key) : ""}
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
                    {t(item.key)}
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
          title={sidebarCollapsed ? common("adminProfile") : ""}
          placement="right"
        >
          <Button
            className="sidebar-profile-button"
            onClick={handleProfileClick}
            aria-label={common("openProfileMenu")}
          >
            <Avatar className="sidebar-profile-avatar">A</Avatar>

            {!sidebarCollapsed && (
              <>
                <Box className="sidebar-profile-info">
                  <Typography className="sidebar-profile-name">
                    Admin
                  </Typography>

                  <Typography className="sidebar-profile-role">
                    {common("administrator")}
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
            <Typography>{common("viewProfile")}</Typography>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} className="sidebar-logout-item">
            <LogoutOutlinedIcon fontSize="small" />
            <Typography>{common("logout")}</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
