"use client";

import { useEffect, useMemo, useState } from "react";

import { Box, Chip, Typography, CircularProgress } from "@mui/material";

import AnnouncementBanner from "@/components/AnnouncementBanner";
import UserSummary from "@/components/UserSummary";
import UserTable from "@/components/UserTable";

import type { User } from "@/types";

import "./dashboard.css";

export default function DashboardPage() {
  // User data
  const [users, setUsers] = useState<User[]>([]);

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from database
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

        // Support array response or object response
        const userList = Array.isArray(data)
          ? data
          : (data.users ?? data.data ?? []);

        setUsers(userList);
      } catch (error) {
        console.error("Dashboard users error:", error);

        setError(
          error instanceof Error ? error.message : "Something went wrong.",
        );
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

  // Pagination data
  const paginatedUsers = useMemo(() => {
    const startIndex = page * rowsPerPage;

    return filteredUsers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  // Page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Rows per page change
  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setPage(0);
  };

  return (
    <Box className="dashboard-content">
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

      {/* User Summary Cards */}
      <UserSummary users={users} />

      {/* User Information Heading */}
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

      {/* Loading / Error / User Table */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="empty-users">
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
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
      )}
    </Box>
  );
}
