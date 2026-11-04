"use client";

import { useEffect, useMemo, useState } from "react";

import { Box, Chip, Typography, CircularProgress } from "@mui/material";

import AnnouncementBanner from "@/components/AnnouncementBanner";
import UserSummary from "@/components/users/UserSummary";
import UserTable from "@/components/UserTable";

import type { User } from "@/types";

import "./dashboard.css";
import "../user/user.css";

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load users.");
        }

        const userList = Array.isArray(data)
          ? data
          : (data.users ?? data.data ?? []);

        setUsers(userList);
      } catch (err) {
        console.error("Dashboard users error:", err);

        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search users
  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      [
        user.id,
        user.name,
        user.username,
        user.email,
        user.phone,
        user.nrc,
        user.address,
        user.status,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }, [users, search]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;

    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  return (
    <Box className="dashboard-page">
      <Box className="dashboard-heading">
        <Box className="dashboard-heading-content">
          <h1 className="dashboard-title">Dashboard</h1>

          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening today.
          </p>
        </Box>
      </Box>

      {/* Announcement */}
      <AnnouncementBanner />

      {/* User Summary */}
      <UserSummary users={users} />

      {/* User Information */}
      <Box className="table-heading">
        <Box>
          <Typography component="h2" className="section-title">
            User Information
          </Typography>

          <Typography className="section-subtitle">
            View your registered users
          </Typography>
        </Box>

        <Chip
          label={`${filteredUsers.length} records`}
          className="records-chip"
        />
      </Box>

      {/* Loading */}
      {loading ? (
        <Box className="dashboard-loading">
          <CircularProgress />
        </Box>
      ) : error ? (
        /* Error */
        <Box className="empty-users">
          <Typography className="dashboard-error">{error}</Typography>
        </Box>
      ) : (
        /* User Table */
        <Box className="dashboard-table-wrapper">
          <UserTable
            users={paginatedUsers}
            totalCount={filteredUsers.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            showActions={false}
            showColumnSettings={true}
          />
        </Box>
      )}
    </Box>
  );
}
