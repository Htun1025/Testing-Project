"use client";

import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";

import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";

import PermissionMatrix from "@/components/PermissionMatrix";

import PermissionSummary from "@/components/permissions/PermissionSummary";
import PermissionToolbar from "@/components/permissions/PermissionToolbar";
import PermissionTable from "@/components/permissions/PermissionTable";
import PermissionFormDialog from "@/components/permissions/PermissionFormDialog";

import usePermissions from "@/hooks/usePermissions";
import "@/app/globals.css";

export default function PermissionPage() {
  const {
    roles,
    permissions,
    matrix,

    tab,
    search,
    setSearch,

    moduleFilter,
    setModuleFilter,

    page,
    setPage,

    rowsPerPage,
    setRowsPerPage,

    open,
    editingPermission,
    form,
    setForm,

    modules,
    activePermissionIds,
    filteredPermissions,
    paginatedPermissions,

    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSave,
    handleDelete,
    handlePermissionToggle,
    handleSelectAll,
    handleTabChange,
  } = usePermissions();

  return (
    <Box className="page-container">
      {/* PAGE HEADER */}
      <Box className="page-header">
        <Box className="page-header-content">
          <Typography component="h1" className="page-title">
            Permission Management
          </Typography>

          <Typography component="p" className="page-subtitle">
            Manage system permissions and role access
          </Typography>
        </Box>
      </Box>

      {/* SUMMARY + TOOLBAR */}
      <Box className="summary-row">
        <PermissionSummary permissions={permissions} />

        {tab === 0 && (
          <PermissionToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
            onAdd={openCreateDialog}
          />
        )}
      </Box>

      {/* MAIN CARD */}
      <Paper className="table-card">
        {/* TABS */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          className="permission-tabs"
        >
          <Tab
            icon={<SecurityOutlinedIcon />}
            iconPosition="start"
            label="Permissions"
          />

          <Tab
            icon={<LayersOutlinedIcon />}
            iconPosition="start"
            label="Role Matrix"
          />
        </Tabs>

        {/* PERMISSION TABLE */}
        {tab === 0 && (
          <PermissionTable
            permissions={paginatedPermissions}
            modules={modules}
            moduleFilter={moduleFilter}
            onModuleFilterChange={(value) => {
              setModuleFilter(value);
              setPage(0);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={filteredPermissions.length}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            onPageChange={setPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value);
              setPage(0);
            }}
          />
        )}

        {/* ROLE PERMISSION MATRIX */}
        {tab === 1 && (
          <PermissionMatrix
            roles={roles}
            permissions={permissions}
            matrix={matrix}
            activePermissionIds={activePermissionIds}
            onPermissionToggle={handlePermissionToggle}
            onSelectAll={handleSelectAll}
            showFilters
          />
        )}
      </Paper>

      {/* ADD / EDIT DIALOG */}
      <PermissionFormDialog
        open={open}
        editingPermission={editingPermission}
        form={form}
        onClose={closeDialog}
        onSave={handleSave}
        onFormChange={setForm}
      />
    </Box>
  );
}
