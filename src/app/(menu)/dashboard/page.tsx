"use client";

import { useMemo, useState } from "react";

import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

import AnnouncementBanner from "@/components/AnnouncementBanner";
import StatCard from "@/components/StatCard";
import UsersTable, { type UserRow } from "@/components/UserTable";

import "./dashboard.css";

const sampleUsers: UserRow[] = [
  {
    id: 1,
    name: "Sofia Rodriguez",
    job: "10x Developer",
    amount: "$863.45",
    status: "Approved",
    date: "6/21/2025",
  },
  {
    id: 2,
    name: "Alexander Lee",
    job: "UI Designer",
    amount: "$369.95",
    status: "Pending",
    date: "6/20/2025",
  },
  {
    id: 3,
    name: "Emma Watson",
    job: "Frontend Developer",
    amount: "$86.00",
    status: "Denied",
    date: "6/19/2025",
  },
  {
    id: 4,
    name: "Noah Wilson",
    job: "Backend Developer",
    amount: "$1,200.00",
    status: "Approved",
    date: "6/18/2025",
  },
  {
    id: 5,
    name: "Olivia Martin",
    job: "Product Designer",
    amount: "$520.00",
    status: "Expired",
    date: "6/17/2025",
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return sampleUsers;
    }

    return sampleUsers.filter((user) =>
      [user.name, user.job, user.amount, user.status, user.date].some((value) =>
        value.toLowerCase().includes(keyword),
      ),
    );
  }, [search]);

  return (
    <Box className="dashboard-content">
      {/* Dashboard heading */}
      <Box className="dashboard-heading">
        <Typography component="h1" className="dashboard-title">
          Dashboard
        </Typography>

        <Typography className="dashboard-subtitle">
          Welcome back! Here&apos;s what&apos;s happening today.
        </Typography>
      </Box>

      {/* Announcement */}
      <AnnouncementBanner />

      {/* Statistics */}
      <Grid container spacing={3} className="statistics-grid">
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Total clients"
            value="6389"
            icon={<PeopleAltOutlinedIcon />}
            color="#7e3af2"
            background="#edebfe"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Account balance"
            value="$46,760.89"
            icon={<AccountBalanceWalletOutlinedIcon />}
            color="#0694a2"
            background="#d5f5f6"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="New sales"
            value="376"
            icon={<ShoppingCartOutlinedIcon />}
            color="#ff5a1f"
            background="#fde8e8"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Pending contacts"
            value="35"
            icon={<MonetizationOnOutlinedIcon />}
            color="#0e9f6e"
            background="#def7ec"
          />
        </Grid>
      </Grid>

      {/* Recent activity heading */}
      <Box className="table-heading">
        <Box>
          <Typography component="h2" className="section-title">
            Recent activity
          </Typography>

          <Typography className="section-subtitle">
            Your latest client transactions
          </Typography>
        </Box>

        <Chip
          label={`${filteredUsers.length} records`}
          className="records-chip"
        />
      </Box>

      {/* Recent activity table */}
      <UsersTable users={filteredUsers} />
    </Box>
  );
}
