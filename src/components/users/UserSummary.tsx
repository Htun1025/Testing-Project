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
  const active = users.filter((user) => user.status === "Active").length;

  const inactive = users.filter((user) => user.status === "Inactive").length;

  const summaries = [
    {
      label: "Total Users",
      value: users.length,
      icon: <PeopleAltOutlinedIcon />,
      color: "#7e3af2",
      background: "#edebfe",
    },
    {
      label: "Active Users",
      value: active,
      icon: <CheckCircleOutlineIcon />,
      color: "#057a55",
      background: "#def7ec",
    },
    {
      label: "Inactive Users",
      value: inactive,
      icon: <PersonOffOutlinedIcon />,
      color: "#c81e1e",
      background: "#fde8e8",
    },
  ];

  return (
    <Box className="user-summary-grid">
      {summaries.map((item) => (
        <Paper key={item.label} className="user-summary-card" elevation={0}>
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
