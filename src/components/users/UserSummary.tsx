"use client";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

import type { User, SummaryItem } from "@/types";
import SummaryCards from "@/components/SummaryCard";

type Props = {
  users: User[];
};

export default function UserSummary({ users }: Props) {
  const getStatus = (status: string) =>
    status
      .trim()
      .toUpperCase()
      .replace(/[\s_-]/g, "");

  const active = users.filter(
    (user) => getStatus(user.status) === "ACTIVE",
  ).length;

  const inactive = users.filter(
    (user) => getStatus(user.status) === "INACTIVE",
  ).length;

  const summaries: SummaryItem[] = [
    {
      label: "Total Users",
      value: users.length,
      icon: <PeopleAltOutlinedIcon />,
      color: "#7e3af2",
      background: "#ede9fe",
    },
    {
      label: "Active Users",
      value: active,
      icon: <CheckCircleOutlineIcon />,
      color: "#057a55",
      background: "#dcfce7",
    },
    {
      label: "Inactive Users",
      value: inactive,
      icon: <PersonOffOutlinedIcon />,
      color: "#c81e1e",
      background: "#fee2e2",
    },
  ];

  return <SummaryCards items={summaries} />;
}
