"use client";

import { useEffect, useMemo, useState } from "react";
import type { Permission } from "@/types";

import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "@/app/globals.css";

type MatrixRole = {
  id: number;
  name: string;
};

type PermissionMatrixProps = {
  roles: MatrixRole[];
  permissions: Permission[];
  matrix: Record<number, number[]>;
  activePermissionIds: number[];

  onPermissionToggle: (
    roleId: number,
    permissionId: number,
    checked: boolean,
  ) => void;

  onSelectAll: (roleId: number, checked: boolean) => void;

  showFilters?: boolean;
};

const ACTION_COLUMNS = [
  "Create",
  "Read",
  "Update",
  "Delete",
  "Export",
  "Approve",
  "Manage",
];

export default function PermissionMatrix({
  roles,
  permissions,
  matrix,
  activePermissionIds,
  onPermissionToggle,
  onSelectAll,
  showFilters = false,
}: PermissionMatrixProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">(
    roles[0]?.id ?? "",
  );

  const [selectedModule, setSelectedModule] = useState("ALL");

  // Keep selected role valid
  useEffect(() => {
    if (roles.length === 0) {
      setSelectedRoleId("");
      return;
    }

    const exists = roles.some((role) => role.id === selectedRoleId);

    if (!exists) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  // Active permissions
  const activePermissions = useMemo(
    () =>
      permissions.filter(
        (item) =>
          item.status === "Active" && activePermissionIds.includes(item.id),
      ),
    [permissions, activePermissionIds],
  );

  // Available modules
  const modules = useMemo(
    () => [...new Set(permissions.map((item) => item.module))],
    [permissions],
  );

  // Visible modules
  const visibleModules = useMemo(
    () =>
      showFilters && selectedModule !== "ALL"
        ? modules.filter((module) => module === selectedModule)
        : modules,
    [modules, selectedModule, showFilters],
  );

  // Visible roles
  const visibleRoles = useMemo(() => {
    if (!showFilters) return roles;

    return roles.filter((role) => role.id === selectedRoleId);
  }, [roles, selectedRoleId, showFilters]);

  // Find permission by module and action
  const getPermission = (moduleName: string, action: string) =>
    permissions.find(
      (item) =>
        item.module.toLowerCase() === moduleName.toLowerCase() &&
        item.action.toLowerCase() === action.toLowerCase(),
    );

  // Check selected permission
  const isSelected = (roleId: number, permissionId: number) =>
    (matrix[roleId] ?? []).includes(permissionId);

  // Select all permissions for one action
  const handleActionSelectAll = (
    roleId: number,
    action: string,
    checked: boolean,
  ) => {
    const actionPermissions = activePermissions.filter(
      (item) =>
        item.action.toLowerCase() === action.toLowerCase() &&
        visibleModules.includes(item.module),
    );

    actionPermissions.forEach((permission) => {
      onPermissionToggle(roleId, permission.id, checked);
    });
  };

  // Select all visible permissions
  const handleSelectAll = (roleId: number, checked: boolean) => {
    if (!showFilters || selectedModule === "ALL") {
      onSelectAll(roleId, checked);
      return;
    }

    const modulePermissions = activePermissions.filter(
      (item) => item.module === selectedModule,
    );

    modulePermissions.forEach((permission) => {
      onPermissionToggle(roleId, permission.id, checked);
    });
  };

  return (
    <Box className="permission-matrix">
      {visibleRoles.map((role) => {
        const roleSelectedIds = (matrix[role.id] ?? []).filter((id) =>
          activePermissionIds.includes(id),
        );

        const visibleActivePermissions = activePermissions.filter((item) =>
          visibleModules.includes(item.module),
        );

        const selectedCount = visibleActivePermissions.filter((item) =>
          roleSelectedIds.includes(item.id),
        ).length;

        const allSelected =
          visibleActivePermissions.length > 0 &&
          selectedCount === visibleActivePermissions.length;

        const someSelected = selectedCount > 0 && !allSelected;

        return (
          <Paper key={role.id} className="permission-matrix-card" elevation={0}>
            {/* HEADER + FILTERS */}
            <Box className="permission-matrix-toolbar">
              <Box className="permission-matrix-heading">
                <Typography className="permission-matrix-title">
                  Permission Matrix
                </Typography>

                <Typography className="permission-matrix-subtitle">
                  Configure access permissions for this role
                </Typography>
              </Box>

              <Box className="permission-matrix-controls">
                {showFilters && (
                  <>
                    <FormControl size="small" className="matrix-filter">
                      <InputLabel id="permission-role-label">Role</InputLabel>

                      <Select
                        labelId="permission-role-label"
                        value={selectedRoleId}
                        label="Role"
                        onChange={(event) =>
                          setSelectedRoleId(Number(event.target.value))
                        }
                        disabled={roles.length === 0}
                      >
                        {roles.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" className="matrix-filter">
                      <InputLabel id="permission-module-label">
                        Module
                      </InputLabel>

                      <Select
                        labelId="permission-module-label"
                        value={selectedModule}
                        label="Module"
                        onChange={(event) =>
                          setSelectedModule(event.target.value)
                        }
                      >
                        <MenuItem value="ALL">All Modules</MenuItem>

                        {modules.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}

                <Chip
                  size="small"
                  color="primary"
                  label={`${selectedCount}/${visibleActivePermissions.length} selected`}
                />

                {!showFilters && (
                  <Chip size="small" variant="outlined" label={role.name} />
                )}
              </Box>
            </Box>

            {/* TABLE */}
            <TableContainer className="permission-matrix-container">
              <Table
                size="small"
                stickyHeader
                className="permission-matrix-table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className="matrix-id-column">ID</TableCell>

                    <TableCell className="matrix-module-column">
                      MODULE
                    </TableCell>

                    {ACTION_COLUMNS.map((action) => {
                      const actionPermissions = visibleActivePermissions.filter(
                        (item) =>
                          item.action.toLowerCase() === action.toLowerCase(),
                      );

                      const selectedActionCount = actionPermissions.filter(
                        (item) => roleSelectedIds.includes(item.id),
                      ).length;

                      const actionAllSelected =
                        actionPermissions.length > 0 &&
                        selectedActionCount === actionPermissions.length;

                      const actionSomeSelected =
                        selectedActionCount > 0 && !actionAllSelected;

                      return (
                        <TableCell
                          key={action}
                          align="center"
                          className="matrix-action-column"
                        >
                          <Box className="matrix-action-header">
                            <Typography>{action}</Typography>

                            <Checkbox
                              size="small"
                              checked={actionAllSelected}
                              indeterminate={actionSomeSelected}
                              disabled={actionPermissions.length === 0}
                              onChange={(event) =>
                                handleActionSelectAll(
                                  role.id,
                                  action,
                                  event.target.checked,
                                )
                              }
                              slotProps={{
                                input: {
                                  "aria-label": `Select all ${action} permissions`,
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleModules.map((moduleName, index) => {
                    const modulePermissionIds = activePermissions
                      .filter((item) => item.module === moduleName)
                      .map((item) => item.id);

                    const moduleSelectedCount = modulePermissionIds.filter(
                      (id) => roleSelectedIds.includes(id),
                    ).length;

                    return (
                      <TableRow key={moduleName} className="matrix-module-row">
                        <TableCell className="matrix-id-column">
                          <Typography className="matrix-id">
                            {(index + 1).toString().padStart(2, "0")}
                          </Typography>
                        </TableCell>

                        <TableCell className="matrix-module-column">
                          <Box className="matrix-module-info">
                            <Typography className="matrix-module-name">
                              {moduleName}
                            </Typography>
                          </Box>
                        </TableCell>

                        {ACTION_COLUMNS.map((action) => {
                          const permission = getPermission(moduleName, action);

                          if (!permission) {
                            return (
                              <TableCell
                                key={action}
                                align="center"
                                className="matrix-action-column"
                              >
                                <Typography className="matrix-empty">
                                  —
                                </Typography>
                              </TableCell>
                            );
                          }

                          const active =
                            permission.status === "Active" &&
                            activePermissionIds.includes(permission.id);

                          return (
                            <TableCell
                              key={action}
                              align="center"
                              className="matrix-action-column"
                            >
                              <Checkbox
                                size="small"
                                checked={isSelected(role.id, permission.id)}
                                disabled={!active}
                                onChange={(event) =>
                                  onPermissionToggle(
                                    role.id,
                                    permission.id,
                                    event.target.checked,
                                  )
                                }
                                slotProps={{
                                  input: {
                                    "aria-label": `${moduleName} ${action}`,
                                  },
                                }}
                              />
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}

                  {visibleModules.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={ACTION_COLUMNS.length + 2}
                        align="center"
                      >
                        No permissions available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* FOOTER */}
            <Box className="permission-matrix-footer">
              <Typography>
                {visibleModules.length} modules ·{" "}
                {visibleActivePermissions.length} active permissions
              </Typography>

              <Box className="matrix-footer-actions">
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={someSelected}
                  disabled={visibleActivePermissions.length === 0}
                  onChange={(event) =>
                    handleSelectAll(role.id, event.target.checked)
                  }
                  slotProps={{
                    input: {
                      "aria-label": "Select all visible permissions",
                    },
                  }}
                />

                <Typography>Select all</Typography>
              </Box>
            </Box>
          </Paper>
        );
      })}

      {visibleRoles.length === 0 && (
        <Paper className="permission-matrix-card" elevation={0}>
          <Box className="permission-matrix-empty">
            <Typography color="text.secondary">
              {roles.length === 0
                ? "No roles available."
                : "Please select a role."}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
