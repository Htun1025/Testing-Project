"use client";

import { Box, Alert, Typography } from "@mui/material";

import RoleSummary from "@/components/roles/RoleSummary";
import RoleToolbar from "@/components/roles/RoleToolbar";
import RoleTable from "@/components/roles/RoleTable";
import RoleFormDialog from "@/components/roles/RoleFormDialog";

import useRoles from "@/hooks/useRole";
import "@/app/globals.css";

export default function RolePage() {
  const {
    roles,
    permissionMatrix,
    activePermissionIds,
    paginatedRoles,
    filteredRoles,
    safePage,

    search,
    setSearch,

    open,
    form,
    matrixRole,

    error,
    setError,
    success,
    setSuccess,

    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,

    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSave,
    handleDelete,
    handleRefresh,
    handleNameChange,
    handleCodeChange,
    handleStatusChange,
    handlePermissionToggle,
    handleSelectAllPermissions,
  } = useRoles();

  return (
    <Box className="page-container">
      {/* PAGE HEADER */}
      <Box className="page-header">
        <Box className="page-header-content">
          <Typography component="h1" className="page-title">
            Role Management
          </Typography>

          <Typography component="p" className="page-subtitle">
            Manage system roles and access levels
          </Typography>
        </Box>
      </Box>

      {/* NOTIFICATIONS */}
      {error && !open && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          className="alert"
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 1.5, background: "#4f93e650" }}
        >
          {success}
        </Alert>
      )}

      {/* SUMMARY + TOOLBAR */}
      <Box className="summary-row">
        <RoleSummary roles={roles} />

        <RoleToolbar
          search={search}
          onSearchChange={(value: string) => {
            setSearch(value);
            setPage(0);
          }}
          onAdd={openCreateDialog}
        />
      </Box>

      {/* ROLES TABLE */}
      <RoleTable
        roles={paginatedRoles}
        permissionMatrix={permissionMatrix}
        activePermissionIds={activePermissionIds}
        page={safePage}
        rowsPerPage={rowsPerPage}
        totalCount={filteredRoles.length}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        onPageChange={setPage}
        onRowsPerPageChange={(value: number) => {
          setRowsPerPage(value);
          setPage(0);
        }}
      />

      {/* ROLE FORM DIALOG */}
      <RoleFormDialog
        open={open}
        editingRole={Boolean(
          // Editing role ရှိ/မရှိကို Hook ကနေ ပေးထားတဲ့ flag ဖြင့် စစ်နိုင်ပါတယ်။
          false,
        )}
        form={form}
        error={error}
        matrixRole={matrixRole}
        permissionMatrix={permissionMatrix}
        activePermissionIds={activePermissionIds}
        onClose={closeDialog}
        onSave={handleSave}
        onNameChange={handleNameChange}
        onCodeChange={handleCodeChange}
        onStatusChange={handleStatusChange}
        onPermissionToggle={handlePermissionToggle}
        onSelectAll={handleSelectAllPermissions}
      />
    </Box>
  );
}
