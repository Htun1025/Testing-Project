"use client";

import { Avatar, Box, Paper, Typography } from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";

import type { User } from "@/types";
import "@/app/(menu)/user/user.css";

type Props = {
  users: User[];
};

export default function UserSummary({ users }: Props) {
  // Status ကို တစ်ပုံစံတည်း ပြောင်းရန်
  const getStatus = (status: string) =>
    status
      .trim()
      .toUpperCase()
      .replace(/[\s_-]/g, "");

  // Active Users
  const active = users.filter(
    (user) => getStatus(user.status) === "ACTIVE",
  ).length;

  // Inactive Users
  const inactive = users.filter(
    (user) => getStatus(user.status) === "INACTIVE",
  ).length;

  const summaries = [
    {
      label: "Total Users",
      value: users.length,
      icon: <PeopleAltOutlinedIcon />,
      color: "#7e3af2",
      background: "#e1e0e4",
    },
    {
      label: "Active Users",
      value: active,
      icon: <CheckCircleOutlineIcon />,
      color: "#057a55",
      background: "#e1e0e4",
    },
    {
      label: "Inactive Users",
      value: inactive,
      icon: <PersonOffOutlinedIcon />,
      color: "#c81e1e",
      background: "#e1e0e4",
    },
  ];

  return (
    <Box className="user-summary-grid">
      {summaries.map((item) => (
        <Paper
          key={item.label}
          className="user-summary-card"
          elevation={0}
          sx={{ backgroundColor: item.background }}
        >
          <Avatar
            className="user-summary-icon"
            sx={{
              color: item.color,
              bgcolor: item.background,
            }}
          >
            {item.icon}
          </Avatar>

          <Box>
            <Typography className="user-summary-label">{item.label}</Typography>

            <Typography className="user-summary-value">{item.value}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
