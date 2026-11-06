"use client";

import { useMemo, useState } from "react";
import type { Role, Permission } from "@/types";
import { initialRoles } from "@/data/RoleData";
import { initialPermissions } from "@/data/PermissionData";

import {
  Box,
  Button,
  Checkbox,
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import "./permission.css";
import PermissionMatrix from "@/components/PermissionMatrix";

type PermissionForm = {
  name: string;
  module: string;
  action: string;
  description: string;
  status: "Active" | "Inactive";
};

const defaultForm: PermissionForm = {
  name: "",
  module: "User",
  action: "Read",
  description: "",
  status: "Active",
};

// Create initial role permission matrix
const createInitialMatrix = (roles: Role[]) => {
  return Object.fromEntries(
    roles.map((role) => [
      role.id,
      role.name.toLowerCase() === "admin"
        ? initialPermissions
            .filter((permission) => permission.status === "Active")
            .map((permission) => permission.id)
        : [],
    ]),
  ) as Record<number, number[]>;
};

export default function PermissionPage() {
  const [roles] = useState<Role[]>(initialRoles);

  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);

  const [matrix, setMatrix] = useState<Record<number, number[]>>(() =>
    createInitialMatrix(initialRoles),
  );

  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [open, setOpen] = useState(false);

  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );

  const [form, setForm] = useState<PermissionForm>(defaultForm);

  // Available modules
  const modules = useMemo(
    () => [...new Set(permissions.map((item) => item.module))],
    [permissions],
  );

  // Active permission IDs
  const activePermissionIds = useMemo(
    () =>
      permissions
        .filter((item) => item.status === "Active")
        .map((item) => item.id),
    [permissions],
  );

  // Search and filter permissions
  const filteredPermissions = useMemo(() => {
    return permissions.filter((item) => {
      const searchText =
        `${item.name} ${item.module} ${item.action} ${item.description}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesModule =
        moduleFilter === "All" || item.module === moduleFilter;

      return matchesSearch && matchesModule;
    });
  }, [permissions, search, moduleFilter]);

  // Pagination
  const paginatedPermissions = useMemo(() => {
    const start = page * rowsPerPage;

    return filteredPermissions.slice(start, start + rowsPerPage);
  }, [filteredPermissions, page, rowsPerPage]);

  // Summary values
  const activeCount = activePermissionIds.length;
  const activeModules = modules.length;

  // Open add dialog
  const openCreateDialog = () => {
    setEditingPermission(null);
    setForm({ ...defaultForm });
    setOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (item: Permission) => {
    setEditingPermission(item);

    setForm({
      name: item.name,
      module: item.module,
      action: item.action,
      description: item.description,
      status: item.status,
    });

    setOpen(true);
  };

  // Save permission
  const handleSave = () => {
    const name = form.name.trim();

    if (!name) return;

    if (editingPermission) {
      setPermissions((previous) =>
        previous.map((item) =>
          item.id === editingPermission.id ? { ...item, ...form, name } : item,
        ),
      );
    } else {
      const newPermission: Permission = {
        id: Math.max(0, ...permissions.map((item) => item.id)) + 1,
        ...form,
        name,
      };

      setPermissions((previous) => [...previous, newPermission]);

      // Go to the last page after adding
      setPage(Math.floor(permissions.length / rowsPerPage));
    }

    setOpen(false);
  };

  // Delete permission
  const handleDelete = (id: number) => {
    setPermissions((previous) => {
      const updated = previous.filter((item) => item.id !== id);

      const filteredCount = updated.filter((item) => {
        const searchText =
          `${item.name} ${item.module} ${item.action} ${item.description}`.toLowerCase();

        const matchesSearch = searchText.includes(search.toLowerCase());
        const matchesModule =
          moduleFilter === "All" || item.module === moduleFilter;

        return matchesSearch && matchesModule;
      }).length;

      const lastPage = Math.max(0, Math.ceil(filteredCount / rowsPerPage) - 1);

      setPage((current) => Math.min(current, lastPage));

      return updated;
    });

    // Remove deleted permission from every role
    setMatrix((previous) => {
      const updated = { ...previous };

      Object.keys(updated).forEach((roleId) => {
        updated[Number(roleId)] = updated[Number(roleId)].filter(
          (permissionId) => permissionId !== id,
        );
      });

      return updated;
    });
  };

  // Update one role permission
  const handlePermissionToggle = (
    roleId: number,
    permissionId: number,
    checked: boolean,
  ) => {
    setMatrix((previous) => {
      const currentPermissions = previous[roleId] || [];

      return {
        ...previous,
        [roleId]: checked
          ? currentPermissions.includes(permissionId)
            ? currentPermissions
            : [...currentPermissions, permissionId]
          : currentPermissions.filter((id) => id !== permissionId),
      };
    });
  };

  // Select or deselect all active permissions
  const handleSelectAll = (roleId: number, checked: boolean) => {
    setMatrix((previous) => ({
      ...previous,
      [roleId]: checked ? [...activePermissionIds] : [],
    }));
  };

  // Count selected permissions
  const getRolePermissionCount = (roleId: number) => {
    return (matrix[roleId] || []).length;
  };

  // Change tab
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setSearch("");
    setModuleFilter("All");
    setPage(0);
  };

  return (
    <Box className="permission-page">
      {/* Page Header */}
      <Box className="permission-header">
        <Box className="permission-header-content">
          <Typography component="h1" className="permission-title">
            Permission Management
          </Typography>

          <Typography component="p" className="permission-subtitle">
            Manage system permissions and role access
          </Typography>
        </Box>
      </Box>

      {/* Summary + Search */}
      <Box className="permission-summary-row">
        <Box className="permission-summary">
          <Paper className="permission-summary-card">
            <Box className="permission-summary-icon purple">
              <SecurityOutlinedIcon />
            </Box>

            <Box className="permission-summary-info">
              <Typography className="permission-summary-label">
                Total Permissions
              </Typography>

              <Typography className="permission-summary-value">
                {permissions.length}
              </Typography>
            </Box>
          </Paper>

          <Paper className="permission-summary-card">
            <Box className="permission-summary-icon blue">
              <LayersOutlinedIcon />
            </Box>

            <Box className="permission-summary-info">
              <Typography className="permission-summary-label">
                Modules
              </Typography>

              <Typography className="permission-summary-value">
                {activeModules}
              </Typography>
            </Box>
          </Paper>

          <Paper className="permission-summary-card">
            <Box className="permission-summary-icon green">
              <CheckCircleOutlineIcon />
            </Box>

            <Box className="permission-summary-info">
              <Typography className="permission-summary-label">
                Active Permissions
              </Typography>

              <Typography className="permission-summary-value">
                {activeCount}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {tab === 0 && (
          <Stack
            direction="row"
            spacing={1}
            className="permission-header-actions"
          >
            <TextField
              className="permission-search"
              size="small"
              placeholder="Search permissions..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              className="permission-add-button"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              Add Permission
            </Button>
          </Stack>
        )}
      </Box>

      {/* Main Card */}
      <Paper className="permission-main-card">
        {/* Tabs */}
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

        {/* Permission List */}
        {tab === 0 && (
          <>
            <Box className="permission-toolbar">
              <Typography className="permission-section-title">
                All Permissions
              </Typography>

              <TextField
                select
                size="small"
                className="permission-module-filter"
                value={moduleFilter}
                onChange={(event) => {
                  setModuleFilter(event.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All Modules</MenuItem>

                {modules.map((module) => (
                  <MenuItem key={module} value={module}>
                    {module}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TableContainer className="permission-table-container">
              <Table className="permission-table">
                <TableHead>
                  <TableRow>
                    <TableCell>PERMISSION</TableCell>
                    <TableCell>MODULE</TableCell>
                    <TableCell>ACTION</TableCell>
                    <TableCell>DESCRIPTION</TableCell>
                    <TableCell align="center">STATUS</TableCell>
                    <TableCell align="right">ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedPermissions.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Typography className="permission-name">
                          {item.name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          className="permission-module-chip"
                          label={item.module}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Typography className="permission-cell">
                          {item.action}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography className="permission-description">
                          {item.description || "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          className={`permission-status ${item.status.toLowerCase()}`}
                          label={item.status}
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
                            className="permission-action-button"
                            size="small"
                            title="Edit permission"
                            onClick={() => openEditDialog(item)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>

                          <IconButton
                            className="permission-action-button delete"
                            size="small"
                            title="Delete permission"
                            onClick={() => handleDelete(item.id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {filteredPermissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography className="permission-empty">
                          No permissions found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredPermissions.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Rows:"
              sx={{
                borderTop: "1px solid var(--border-color, #e2e8f0)",
                "& .MuiTablePagination-toolbar": {
                  minHeight: 42,
                  fontSize: 12,
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: 11,
                  },
                "& .MuiTablePagination-select": {
                  fontSize: 11,
                },
                "& .MuiIconButton-root": {
                  padding: "4px",
                },
              }}
            />
          </>
        )}

        {/* Role Permission Matrix */}
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

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        className="permission-dialog"
      >
        <DialogTitle className="permission-dialog-title">
          {editingPermission ? "Edit Permission" : "Add New Permission"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              label="Permission Name"
              size="small"
              fullWidth
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
            />

            <TextField
              select
              label="Module"
              size="small"
              fullWidth
              value={form.module}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  module: event.target.value,
                }))
              }
            >
              {["User", "Role", "Dashboard", "Permission", "Settings"].map(
                (module) => (
                  <MenuItem key={module} value={module}>
                    {module}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              select
              label="Action"
              size="small"
              fullWidth
              value={form.action}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  action: event.target.value,
                }))
              }
            >
              {["Create", "Read", "Update", "Delete", "Manage"].map(
                (action) => (
                  <MenuItem key={action} value={action}>
                    {action}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              label="Description"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={form.description}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  description: event.target.value,
                }))
              }
            />

            <TextField
              select
              label="Status"
              size="small"
              fullWidth
              value={form.status}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  status: event.target.value as "Active" | "Inactive",
                }))
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions className="permission-dialog-actions">
          <Button color="inherit" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name.trim()}
          >
            {editingPermission ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
