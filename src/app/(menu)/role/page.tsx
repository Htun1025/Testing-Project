"use client";

import { useMemo, useState } from "react";

import type { Role, SummaryItem } from "@/types";
import { initialRoles } from "@/data/RoleData";
import SummaryCards from "@/components/SummaryCard";

import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";

import "./role.css";

export default function RolePage() {
  const [role, setRole] = useState<Role[]>(initialRoles);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Summary Counts
  const activeRoles = role.filter((item) => item.status === "Active").length;

  const inactiveRoles = role.filter(
    (item) => item.status === "Inactive",
  ).length;

  // Summary Cards
  const summaries: SummaryItem[] = [
    {
      label: "Total Roles",
      value: role.length,
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

  // Search Roles
  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return role.filter((item) =>
      `${item.name} ${item.description}`.toLowerCase().includes(keyword),
    );
  }, [role, search]);

  // Open Add Dialog
  const openCreateDialog = () => {
    setEditingRole(null);

    setForm({
      name: "",
      description: "",
      status: "Active",
    });

    setOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (item: Role) => {
    setEditingRole(item);

    setForm({
      name: item.name,
      description: item.description,
      status: item.status,
    });

    setOpen(true);
  };

  // Save Role
  const handleSave = () => {
    const name = form.name.trim().toLowerCase();

    if (!name) return;

    const duplicate = role.some(
      (item) => item.name.toLowerCase() === name && item.id !== editingRole?.id,
    );

    if (duplicate) {
      alert("This role name already exists.");
      return;
    }

    if (editingRole) {
      setRole((previous) =>
        previous.map((item) =>
          item.id === editingRole.id
            ? {
                ...item,
                name,
                description: form.description.trim(),
                status: form.status,
              }
            : item,
        ),
      );
    } else {
      const newRole: Role = {
        id: Math.max(0, ...role.map((item) => item.id)) + 1,
        name,
        description: form.description.trim(),
        status: form.status,
        users: 0,
        permissions: 0,
      };

      setRole((previous) => [...previous, newRole]);
    }

    setOpen(false);
  };

  // Delete Role
  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role?",
    );

    if (!confirmed) return;

    setRole((previous) => previous.filter((item) => item.id !== id));
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

      {/* Summary Cards + Search + Add */}
      <Box className="roles-summary-row">
        {/* Summary Cards */}
        <Box className="roles-summary-content">
          <SummaryCards items={summaries} />
        </Box>

        {/* Search + Add Button */}
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
      <Paper className="roles-table-card">
        <Box className="roles-toolbar">
          <Typography className="roles-selection-title">All Roles</Typography>
        </Box>

        <TableContainer>
          <Table className="roles-table">
            <TableHead>
              <TableRow>
                <TableCell>ROLE NAME</TableCell>
                <TableCell>DESCRIPTION</TableCell>
                <TableCell align="center">USERS</TableCell>
                <TableCell align="center">PERMISSIONS</TableCell>
                <TableCell align="center">STATUS</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRoles.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography className="role-field">{item.name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography className="role-field">
                      {item.description || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">{item.users}</TableCell>

                  <TableCell align="center">{item.permissions}</TableCell>

                  <TableCell align="center">
                    <Chip
                      className={`role-status ${item.status.toLowerCase()}`}
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
                        onClick={() => handleDelete(item.id)}
                        title="Delete role"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRoles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography
                      sx={{
                        py: 2,
                        fontSize: 12,
                        color: "#94a3b8",
                      }}
                    >
                      No roles found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Role Name"
              fullWidth
              size="small"
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              size="small"
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
              fullWidth
              size="small"
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

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.name.trim()}
          >
            {editingRole ? "Update Role" : "Save Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
