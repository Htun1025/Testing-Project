"use client";

import { Box } from "@mui/material";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import type { Role, SummaryItem } from "@/types";
import SummaryCards from "@/components/SummaryCard";
import "@/app/globals.css";

interface RoleSummaryProps {
  roles: Role[];
}

export default function RoleSummary({ roles }: RoleSummaryProps) {
  const activeRoles = roles.filter((role) => role.status === "ACTIVE").length;

  const inactiveRoles = roles.filter(
    (role) => role.status === "INACTIVE",
  ).length;

  const summaries: SummaryItem[] = [
    {
      label: "Total Roles",
      value: roles.length,
      icon: <GroupsOutlinedIcon />,
      color: "#7c3aed",
      background: "#ede9fe",
    },
    {
      label: "Active Roles",
      value: activeRoles,
      icon: <CheckCircleOutlineIcon />,
      color: "#059669",
      background: "#d1fae5",
    },
    {
      label: "Inactive Roles",
      value: inactiveRoles,
      icon: <BlockOutlinedIcon />,
      color: "#dc2626",
      background: "#fee2e2",
    },
  ];

  return (
    <Box className="summary-content">
      <SummaryCards items={summaries} />
    </Box>
  );
}
