"use client";

import { useMemo, useState } from "react";
import type { SummaryItem, Role, RoleForm, RoleStatus } from "@/types";

import SummaryCards from "@/components/SummaryCard";
import PermissionMatrix from "@/components/PermissionMatrix";

import { initialRoles } from "@/data/RoleData";
import { initialPermissions } from "@/data/PermissionData";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import "./role.css";

const DRAFT_ROLE_ID = -1;

const initialForm: RoleForm = {
  name: "",
  code: "",
  status: "ACTIVE",
};

export default function RolePage() {
  // STATE

  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const [form, setForm] = useState<RoleForm>(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ACTIVE PERMISSIONS

  const activePermissionIds = useMemo(
    () =>
      initialPermissions
        .filter((permission) => permission.status === "Active")
        .map((permission) => permission.id),
    [],
  );

  // PERMISSION MATRIX

  const [permissionMatrix, setPermissionMatrix] = useState<
    Record<number, number[]>
  >(() =>
    Object.fromEntries(
      initialRoles.map((role) => [
        role.id,
        role.code === "ADMIN" ? activePermissionIds : [],
      ]),
    ),
  );

  // SUMMARY

  const activeRoles = roles.filter((role) => role.status === "ACTIVE").length;

  const inactiveRoles = roles.filter(
    (role) => role.status === "INACTIVE",
  ).length;

  const summaries: SummaryItem[] = [
    {
      label: "Total Roles",
      value: roles.length,
      icon: <GroupsOutlinedIcon />,
      color: "#7c3aed",
      background: "#ede9fe",
    },
    {
      label: "Active Roles",
      value: activeRoles,
      icon: <CheckCircleOutlineIcon />,
      color: "#059669",
      background: "#d1fae5",
    },
    {
      label: "Inactive Roles",
      value: inactiveRoles,
      icon: <BlockOutlinedIcon />,
      color: "#dc2626",
      background: "#fee2e2",
    },
  ];

  // SEARCH

  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return roles;

    return roles.filter((role) =>
      `${role.name} ${role.code} ${role.status}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [roles, search]);

  // PAGINATION

  const safePage = Math.min(
    page,
    Math.max(0, Math.ceil(filteredRoles.length / rowsPerPage) - 1),
  );

  const paginatedRoles = useMemo(() => {
    const start = safePage * rowsPerPage;
    return filteredRoles.slice(start, start + rowsPerPage);
  }, [filteredRoles, safePage, rowsPerPage]);

  // OPEN CREATE DIALOG

  const openCreateDialog = () => {
    setEditingRole(null);
    setForm(initialForm);
    setError("");

    setPermissionMatrix((previous) => ({
      ...previous,
      [DRAFT_ROLE_ID]: [],
    }));

    setOpen(true);
  };

  // OPEN EDIT DIALOG

  const openEditDialog = (role: Role) => {
    setEditingRole(role);

    setForm({
      name: role.name,
      code: role.code,
      status: role.status,
    });

    setPermissionMatrix((previous) => ({
      ...previous,
      [role.id]: previous[role.id] ?? [],
    }));

    setError("");
    setOpen(true);
  };

  // CLOSE DIALOG

  const closeDialog = () => {
    setOpen(false);
    setEditingRole(null);
    setForm(initialForm);
    setError("");

    setPermissionMatrix((previous) => {
      const { [DRAFT_ROLE_ID]: removed, ...rest } = previous;
      return rest;
    });
  };

  // PERMISSION TOGGLE

  const handlePermissionToggle = (
    roleId: number,
    permissionId: number,
    checked: boolean,
  ) => {
    setPermissionMatrix((previous) => {
      const currentIds = previous[roleId] ?? [];

      const updatedIds = checked
        ? [...new Set([...currentIds, permissionId])]
        : currentIds.filter((id) => id !== permissionId);

      return {
        ...previous,
        [roleId]: updatedIds,
      };
    });
  };

  // SELECT ALL PERMISSIONS

  const handleSelectAllPermissions = (roleId: number, checked: boolean) => {
    setPermissionMatrix((previous) => ({
      ...previous,
      [roleId]: checked ? [...activePermissionIds] : [],
    }));
  };

  // SAVE ROLE

  const handleSave = () => {
    const name = form.name.trim();
    const code = form.code.trim();

    if (!name) {
      setError("Please enter a role name.");
      return;
    }

    if (name !== name.toUpperCase()) {
      setError("Role name must be uppercase.");
      return;
    }

    if (!code) {
      setError("Please enter a role code.");
      return;
    }

    if (code !== code.toUpperCase()) {
      setError("Role code must be uppercase.");
      return;
    }

    if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
      setError(
        "Role code must start with a letter and contain only uppercase letters, numbers, and underscores.",
      );
      return;
    }

    const duplicateCode = roles.some(
      (role) =>
        role.code.toLowerCase() === code.toLowerCase() &&
        role.id !== editingRole?.id,
    );

    if (duplicateCode) {
      setError("This role code already exists.");
      return;
    }

    const now = new Date().toISOString();

    if (editingRole) {
      setRoles((previous) =>
        previous.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                name,
                code,
                status: form.status,
                updatedAt: now,
              }
            : role,
        ),
      );

      setSuccess("Role updated successfully.");
    } else {
      const newRole: Role = {
        id: Math.max(0, ...roles.map((role) => role.id)) + 1,
        name,
        code,
        description: `${name} role`,
        status: form.status,
        createdAt: now,
        updatedAt: now,
        _count: {
          users: 0,
          rolePermissions: 0,
        },
      };

      setRoles((previous) => [newRole, ...previous]);

      setPermissionMatrix((previous) => {
        const selectedIds = previous[DRAFT_ROLE_ID] ?? [];
        const { [DRAFT_ROLE_ID]: removed, ...rest } = previous;

        return {
          ...rest,
          [newRole.id]: selectedIds,
        };
      });

      setPage(0);
      setSuccess("Role created successfully.");
    }

    closeDialog();
  };

  // DELETE ROLE

  const handleDelete = () => {
    if (!deleteTarget) return;

    if ((deleteTarget._count?.users ?? 0) > 0) {
      setError("A role assigned to existing users cannot be deleted.");
      setDeleteTarget(null);
      return;
    }

    const deletedId = deleteTarget.id;

    setRoles((previous) => previous.filter((role) => role.id !== deletedId));

    setPermissionMatrix((previous) => {
      const { [deletedId]: removed, ...rest } = previous;
      return rest;
    });

    setDeleteTarget(null);
    setSuccess("Role deleted successfully.");

    const remainingCount = filteredRoles.length - 1;
    const lastPage = Math.max(0, Math.ceil(remainingCount / rowsPerPage) - 1);

    setPage((currentPage) => Math.min(currentPage, lastPage));
  };

  // REFRESH FAKE DATA

  const handleRefresh = () => {
    setRoles(initialRoles);

    setPermissionMatrix(
      Object.fromEntries(
        initialRoles.map((role) => [
          role.id,
          role.code === "ADMIN" ? activePermissionIds : [],
        ]),
      ),
    );

    setSearch("");
    setPage(0);
    setError("");
    setSuccess("Role data refreshed.");
  };

  // MATRIX ROLE

  const matrixRole = {
    id: editingRole?.id ?? DRAFT_ROLE_ID,
    name: form.name.trim() || "NEW ROLE",
  };

  const selectedPermissionCount = (
    permissionMatrix[matrixRole.id] ?? []
  ).filter((id) => activePermissionIds.includes(id)).length;

  // UI

  return (
    <Box className="roles-page">
      {/* PAGE HEADER */}
      <Box className="roles-header">
        <Box className="roles-header-content">
          <Typography component="h1" className="roles-title">
            Role Management
          </Typography>

          <Typography component="p" className="roles-subtitle">
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
          severity="success"
          onClose={() => setSuccess("")}
          sx={{ mb: 1.5 }}
        >
          {success}
        </Alert>
      )}

      {/* SUMMARY + SEARCH + ADD */}
      <Box className="roles-summary-row">
        <Box className="roles-summary-content">
          <SummaryCards items={summaries} />
        </Box>

        <Stack direction="row" spacing={1} className="roles-header-actions">
          <TextField
            className="roles-search"
            size="small"
            placeholder="Search roles..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            className="role-add-button"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            Add Role
          </Button>
        </Stack>
      </Box>

      {/* ROLES TABLE */}
      <Paper className="roles-table-card" elevation={0}>
        <Box className="roles-toolbar">
          <Typography className="roles-selection-title">All Roles</Typography>

          <Button size="small" onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table className="roles-table" size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ROLE NAME</TableCell>
                <TableCell>ROLE CODE</TableCell>
                <TableCell align="center">USERS</TableCell>
                <TableCell align="center">PERMISSIONS</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography sx={{ py: 3, fontSize: 12 }}>
                      No roles found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <Typography className="role-field">
                        {role.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={role.code}
                        size="small"
                        className="role-code-chip"
                      />
                    </TableCell>

                    <TableCell align="center">
                      {role._count?.users ?? 0}
                    </TableCell>

                    <TableCell align="center">
                      {
                        (permissionMatrix[role.id] ?? []).filter((id) =>
                          activePermissionIds.includes(id),
                        ).length
                      }
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        className={`role-status ${role.status.toLowerCase()}`}
                        label={role.status === "ACTIVE" ? "Active" : "Inactive"}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <IconButton
                          className="role-action-button"
                          size="small"
                          onClick={() => openEditDialog(role)}
                          title="Edit role"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          className="role-action-button delete"
                          size="small"
                          onClick={() => setDeleteTarget(role)}
                          title="Delete role"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          component="div"
          count={filteredRoles.length}
          page={safePage}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows:"
          sx={{
            borderTop: "1px solid var(--border-color, #e2e8f0)",
            "& .MuiTablePagination-toolbar": {
              minHeight: 38,
              fontSize: 11,
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: 10,
              },
            "& .MuiTablePagination-select": {
              fontSize: 10,
            },
            "& .MuiIconButton-root": {
              padding: "4px",
            },
          }}
        />
      </Paper>

      {/* ADD / EDIT ROLE DIALOG */}
      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        className="role-dialog"
      >
        <DialogTitle className="role-dialog-title">
          <Box>
            <Typography className="role-dialog-heading">
              {editingRole ? "Edit Role" : "Add New Role"}
            </Typography>

            <Typography className="role-dialog-subtitle">
              Configure role information and access permissions
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent className="role-dialog-content" dividers>
          <Stack spacing={1.5}>
            {/* ROLE INFORMATION */}
            <Box className="role-form-section">
              <Typography className="role-section-title">
                Role Information
              </Typography>

              <Box className="role-form-grid">
                <TextField
                  label="Role Name"
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. SUPERVISOR"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  error={
                    form.name.length > 0 &&
                    form.name !== form.name.toUpperCase()
                  }
                  helperText={
                    form.name.length > 0 &&
                    form.name !== form.name.toUpperCase()
                      ? "Use uppercase letters."
                      : "Uppercase letters, numbers and underscores."
                  }
                />

                <TextField
                  label="Role Code"
                  required
                  fullWidth
                  size="small"
                  placeholder="e.g. SUPERVISOR"
                  value={form.code}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      code: event.target.value,
                    }))
                  }
                  error={
                    form.code.length > 0 &&
                    form.code !== form.code.toUpperCase()
                  }
                  helperText={
                    form.code.length > 0 &&
                    form.code !== form.code.toUpperCase()
                      ? "Use uppercase letters."
                      : "Start with a letter; use uppercase and underscores."
                  }
                />

                <TextField
                  select
                  label="Status"
                  fullWidth
                  size="small"
                  value={form.status}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      status: event.target.value as RoleStatus,
                    }))
                  }
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </TextField>
              </Box>
            </Box>

            {/* PERMISSION MATRIX */}
            <Box className="role-matrix-section">
              <Box className="role-matrix-heading">
                <Box>
                  <Typography className="role-section-title">
                    Role Permissions
                  </Typography>

                  <Typography className="role-matrix-description">
                    Select which permissions this role can access.
                  </Typography>
                </Box>
              </Box>

              <Box className="role-matrix-container">
                <PermissionMatrix
                  roles={[matrixRole]}
                  permissions={initialPermissions}
                  matrix={permissionMatrix}
                  activePermissionIds={activePermissionIds}
                  onPermissionToggle={handlePermissionToggle}
                  onSelectAll={handleSelectAllPermissions}
                />
              </Box>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions className="role-dialog-actions">
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name.trim() || !form.code.trim()}
          >
            {editingRole ? "Update Role" : "Save Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Role</DialogTitle>

        <DialogContent>
          <Typography sx={{ fontSize: 13 }}>
            Are you sure you want to delete
            <strong> {deleteTarget?.name}</strong>?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 11,
              color: "text.secondary",
            }}
          >
            A role assigned to existing users cannot be deleted.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
