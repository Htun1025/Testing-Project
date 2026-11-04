"use client";

import { Box, Paper } from "@mui/material";

import useUsers from "@/hooks/useUser";

import UserSummary from "@/components/users/UserSummary";
import UserToolbar from "@/components/users/UserToolbar";
import UserTable from "@/components/UserTable";
import UserDialog from "@/components/User_Add_Edit_Card";

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
      <Box className="user-page-heading">
        <Box className="user-page-heading-content">
          <h1 className="user-page-title">User Management</h1>

          <p className="user-page-subtitle">
            Manage users, contact information and account status.
          </p>
        </Box>
      </Box>

      <Box className="user-summary-toolbar-row">
        <Box className="user-summary-wrapper">
          <UserSummary users={userState.users} />
        </Box>

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

      {userState.error && !userState.dialogOpen && (
        <Box sx={{ mb: 1, color: "error.main", fontSize: 13 }}>
          {userState.error}
        </Box>
      )}

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

      <UserDialog
        open={userState.dialogOpen}
        editingUser={userState.editingUser}
        form={userState.form}
        error={userState.error}
        loading={userState.loading}
        onFormChange={handleFormChange}
        onClose={userState.closeDialog}
        onSubmit={userState.handleSubmit}
      />
    </Box>
  );
}
