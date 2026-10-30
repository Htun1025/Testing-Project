"use client";

import { Box, Paper } from "@mui/material";

import useUsers from "@/hook/useUser";
import UserSummary from "@/components/users/UserSummary";
import UserToolbar from "@/components/users/UserToolbar";
import UserTable from "@/components/users/UserTable";
import UserDialog from "@/components/users/UserDialog";

import type { UserForm } from "@/types";

import "./user.css";

export default function UserPage() {
  const userState = useUsers();

  const handleFormChange = (field: keyof UserForm, value: string) => {
    userState.setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <Box className="user-page">
      {/* Page Heading */}
      <Box className="user-page-heading">
        <Box className="user-page-heading-content">
          <h1 className="user-page-title">User Management</h1>

          <p className="user-page-subtitle">
            Manage users, contact information and account status.
          </p>
        </Box>

        {/* Search and Create User */}
        <Box className="user-toolbar-section">
          <UserToolbar
            search={userState.search}
            onSearchChange={(value) => {
              userState.setSearch(value);
              userState.setPage(0);
            }}
            onCreate={userState.openCreateDialog}
            count={userState.filteredUsers.length}
          />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box className="user-summary-section">
        <UserSummary users={userState.users} />
      </Box>

      {/* Users Table */}
      <Paper className="user-table-card" elevation={0}>
        <UserTable
          users={userState.visibleUsers}
          totalCount={userState.filteredUsers.length}
          page={userState.page}
          rowsPerPage={userState.rowsPerPage}
          onEdit={userState.openEditDialog}
          onDelete={userState.handleDelete}
          onPageChange={userState.setPage}
          onRowsPerPageChange={userState.handleRowsPerPageChange}
        />
      </Paper>

      {/* Create and Edit Dialog */}
      <UserDialog
        open={userState.dialogOpen}
        editingUser={userState.editingUser}
        form={userState.form}
        onFormChange={handleFormChange}
        onClose={userState.closeDialog}
        onSubmit={userState.handleSubmit}
      />
    </Box>
  );
}
