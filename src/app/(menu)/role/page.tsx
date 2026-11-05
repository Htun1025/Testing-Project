"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { SummaryItem } from "@/types";
import SummaryCards from "@/components/SummaryCard";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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

type RoleStatus = "ACTIVE" | "INACTIVE";

type Role = {
  id: number;
  name: string;
  code: string;
  status: RoleStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    rolePermissions: number;
  };
};

type RoleForm = {
  name: string;
  code: string;
  status: RoleStatus;
};

const initialForm: RoleForm = {
  name: "",
  code: "",
  status: "ACTIVE",
};

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const [form, setForm] = useState<RoleForm>(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/role", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load roles.");
      }

      setRoles(result.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Summary counts
  const activeRoles = roles.filter((item) => item.status === "ACTIVE").length;

  const inactiveRoles = roles.filter(
    (item) => item.status === "INACTIVE",
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

  // Search roles
  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return roles;

    return roles.filter((item) =>
      `${item.name} ${item.code} ${item.status}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [roles, search]);

  // Open create dialog
  const openCreateDialog = () => {
    setEditingRole(null);
    setForm(initialForm);
    setError("");
    setOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (item: Role) => {
    setEditingRole(item);

    setForm({
      name: item.name,
      code: item.code,
      status: item.status,
    });

    setError("");
    setOpen(true);
  };

  // Save role
  const handleSave = async () => {
    const name = form.name.trim();
    const code = form.code.trim();

    if (!name) {
      setError("Please enter a role name.");
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

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const url = editingRole
        ? `/api/admin/role/${editingRole.id}`
        : "/api/admin/role";

      const response = await fetch(url, {
        method: editingRole ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          code,
          status: form.status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save role.");
      }

      setOpen(false);
      setForm(initialForm);
      setEditingRole(null);

      setSuccess(
        editingRole
          ? "Role updated successfully."
          : "Role created successfully.",
      );

      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save role.");
    } finally {
      setSaving(false);
    }
  };

  // Delete role
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/role/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete role.");
      }

      setDeleteTarget(null);
      setSuccess("Role deleted successfully.");

      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box className="roles-page">
      {/* Page Header */}
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

      {/* Notifications */}
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

      {/* Summary Cards + Search + Add */}
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
            onChange={(event) => setSearch(event.target.value)}
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

      {/* Roles Table */}
      <Paper className="roles-table-card" elevation={0}>
        <Box className="roles-toolbar">
          <Typography className="roles-selection-title">All Roles</Typography>

          <Button size="small" onClick={fetchRoles} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </Box>

        <TableContainer>
          <Table className="roles-table">
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        py: 3,
                      }}
                    >
                      <CircularProgress size={20} />
                      <Typography sx={{ fontSize: 12 }}>
                        Loading roles...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography
                      sx={{
                        py: 3,
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      No roles found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography className="role-field">
                        {item.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={item.code}
                        size="small"
                        className="role-code-chip"
                      />
                    </TableCell>

                    <TableCell align="center">
                      {item._count?.users ?? 0}
                    </TableCell>

                    <TableCell align="center">
                      {item._count?.rolePermissions ?? 0}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        className={`role-status ${item.status.toLowerCase()}`}
                        label={item.status === "ACTIVE" ? "Active" : "Inactive"}
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
                          onClick={() => openEditDialog(item)}
                          title="Edit role"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          className="role-action-button delete"
                          size="small"
                          onClick={() => setDeleteTarget(item)}
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
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => !saving && setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Role Name */}
            <TextField
              label="Role Name"
              fullWidth
              size="small"
              required
              placeholder="e.g. Supervisor"
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              error={
                form.name.length > 0 && form.name !== form.name.toUpperCase()
              }
              helperText={
                form.name.length > 0 && form.name !== form.name.toUpperCase()
                  ? "Lowercase letters are not allowed. Use uppercase letters."
                  : "Use uppercase letters, numbers and underscores."
              }
            />

            {/* Role Code */}
            <TextField
              label="Role Code"
              fullWidth
              size="small"
              required
              placeholder="e.g. SUPERVISOR"
              value={form.code}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  code: event.target.value,
                }))
              }
              error={
                form.code.length > 0 && form.code !== form.code.toUpperCase()
              }
              helperText={
                form.code.length > 0 && form.code !== form.code.toUpperCase()
                  ? "Lowercase letters are not allowed. Use uppercase letters."
                  : "Use uppercase letters, numbers and underscores."
              }
            />

            {/* Status */}
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

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            color="inherit"
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.code.trim()}
          >
            {saving ? "Saving..." : editingRole ? "Update Role" : "Save Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !saving && setDeleteTarget(null)}
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
          <Button onClick={() => setDeleteTarget(null)} disabled={saving}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
