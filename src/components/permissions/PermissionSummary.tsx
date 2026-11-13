"use client";

import type { Permission, SummaryItem } from "@/types";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Permissions");

  const activeCount = permissions.filter(
    (item) => item.status === "ACTIVE",
  ).length;

  const activeModules = new Set(permissions.map((item) => item.module)).size;

  const summaries: SummaryItem[] = [
    {
      label: t("totalPermissions"),
      value: permissions.length,
      icon: <SecurityOutlinedIcon />,
      color: "#7c3aed",
      background: "#ede9fe",
    },
    {
      label: t("modules"),
      value: activeModules,
      icon: <LayersOutlinedIcon />,
      color: "#2563eb",
      background: "#dbeafe",
    },
    {
      label: t("activePermissions"),
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
