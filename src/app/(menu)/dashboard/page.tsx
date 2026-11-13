"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

import SummaryCards from "@/components/SummaryCard";
import UserActivityChart from "@/components/dashboard/UserActivityChart";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";

import useDashboardUser from "@/hooks/useDashboardUser";

import type { SummaryItem } from "@/types";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  const {
    loading,
    error,
    totalUsers,
    activeUsers,
    inactiveUsers,
    growthData,
    totalNewUsers,
  } = useDashboardUser();

  const summaryItems: SummaryItem[] = [
    {
      label: t("totalUsers"),
      value: loading ? "—" : totalUsers.toLocaleString(),
      icon: <PeopleAltOutlinedIcon />,
      color: "#7251b3",
      background: "rgba(114, 81, 179, 0.12)",
    },
    {
      label: t("activeUsers"),
      value: loading ? "—" : activeUsers.toLocaleString(),
      icon: <PersonOutlineOutlinedIcon />,
      color: "#16a34a",
      background: "rgba(22, 163, 74, 0.12)",
    },
    {
      label: t("inactiveUsers"),
      value: loading ? "—" : inactiveUsers.toLocaleString(),
      icon: <PersonOffOutlinedIcon />,
      color: "#d97706",
      background: "rgba(217, 119, 6, 0.12)",
    },
  ];

  return (
    <Box className="page-container dashboard-page">
      {/* USER SUMMARY */}
      <SummaryCards items={summaryItems} />

      {/* CHARTS */}
      {!loading && !error && (
        <Box className="dashboard-charts-grid">
          <UserActivityChart />

          <UserGrowthChart
            growthData={growthData}
            totalNewUsers={totalNewUsers}
          />
        </Box>
      )}

      {/* LOADING */}
      {loading && (
        <Box className="dashboard-loading">
          <CircularProgress className="dashboard-loading-spinner" size={26} />

          <Typography className="dashboard-loading-text">
            {t("loading")}
          </Typography>
        </Box>
      )}

      {/* ERROR */}
      {!loading && error && (
        <Box className="empty-users">
          <Typography className="dashboard-error">{error}</Typography>
        </Box>
      )}
    </Box>
  );
}
