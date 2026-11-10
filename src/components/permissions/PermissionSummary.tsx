"use client";

import type { Permission, SummaryItem } from "@/types";

import { Box } from "@mui/material";

import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import SummaryCards from "@/components/SummaryCard";

interface PermissionSummaryProps {
  permissions: Permission[];
}

export default function PermissionSummary({
  permissions,
}: PermissionSummaryProps) {
  const activeCount = permissions.filter(
    (item) => item.status === "Active",
  ).length;

  const activeModules = new Set(permissions.map((item) => item.module)).size;

  const summaries: SummaryItem[] = [
    {
      label: "Total Permissions",
      value: permissions.length,
      icon: <SecurityOutlinedIcon />,
      color: "#7c3aed",
      background: "#ede9fe",
    },
    {
      label: "Modules",
      value: activeModules,
      icon: <LayersOutlinedIcon />,
      color: "#2563eb",
      background: "#dbeafe",
    },
    {
      label: "Active Permissions",
      value: activeCount,
      icon: <CheckCircleOutlineIcon />,
      color: "#059669",
      background: "#d1fae5",
    },
  ];

  return (
    <Box className="summary-content">
      <SummaryCards items={summaries} />
    </Box>
  );
}
