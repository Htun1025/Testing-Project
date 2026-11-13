"use client";

import { Box, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

import useUsers from "@/hooks/useUser";

import UserSummary from "@/components/users/UserSummary";
import UserToolbar from "@/components/users/UserToolbar";
import UserTable from "@/components/users/UserTable";
import UserDialog from "@/components/User_Add_Edit_Card";

import type { User, UserForm } from "@/types";

export default function UserPage() {
  const t = useTranslations("Users");

  const userState = useUsers();

  // Form input ပြောင်းလဲမှုကို handle လုပ်ရန်
  const handleFormChange = (field: keyof UserForm, value: string) => {
    userState.setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Edit button နှိပ်သောအခါ Dialog ဖွင့်ရန်
  const handleEdit = (user: User) => {
    userState.openEditDialog(user);
  };

  return (
    <Box className="page-container user-page">
      {/* PAGE HEADER */}
      <Box className="page-header">
        <Box className="page-header-content">
          <h1 className="page-title">{t("title")}</h1>

          <p className="page-subtitle">{t("subtitle")}</p>
        </Box>
      </Box>

      {/* SUMMARY + TOOLBAR */}
      <Box className="summary-row">
        <Box className="summary-content">
          <UserSummary users={userState.users} />
        </Box>

        <Box className="page-actions">
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

      {/* ERROR MESSAGE */}
      {userState.error && !userState.dialogOpen && (
        <Box className="user-page-error">{userState.error}</Box>
      )}

      {/* USER TABLE */}
      <Paper className="table-card" elevation={0}>
        <UserTable
          users={userState.paginatedUsers}
          totalCount={userState.filteredUsers.length}
          page={userState.page}
          rowsPerPage={userState.rowsPerPage}
          onEdit={handleEdit}
          onDelete={userState.handleDelete}
          onPageChange={userState.setPage}
          onRowsPerPageChange={(value) => {
            userState.setRowsPerPage(Number(value));
            userState.setPage(0);
          }}
        />
      </Paper>

      {/* ADD / EDIT DIALOG */}
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
