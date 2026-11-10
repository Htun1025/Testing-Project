"use client";

import { useMemo, useState } from "react";

import type { Role, RoleForm, RoleStatus } from "@/types";

import { initialRoles } from "@/data/RoleData";
import { initialPermissions } from "@/data/PermissionData";

import {
  DRAFT_ROLE_ID,
  initialForm,
  createInitialRoleMatrix,
} from "@/utils/roleUtils";

export default function useRoles() {
  // Roles
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  // Search
  const [search, setSearch] = useState("");

  // Dialog
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  // Form
  const [form, setForm] = useState<RoleForm>({ ...initialForm });

  // Notifications
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Active permissions
  const activePermissionIds = useMemo(
    () =>
      initialPermissions
        .filter((permission) => permission.status === "Active")
        .map((permission) => permission.id),
    [],
  );

  // Permission matrix
  const [permissionMatrix, setPermissionMatrix] = useState<
    Record<number, number[]>
  >(() => createInitialRoleMatrix(initialRoles, initialPermissions));

  // Search roles
  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return roles;

    return roles.filter((role) =>
      `${role.name} ${role.code} ${role.status}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [roles, search]);

  // Safe pagination page
  const safePage = Math.min(
    page,
    Math.max(0, Math.ceil(filteredRoles.length / rowsPerPage) - 1),
  );

  // Paginated roles
  const paginatedRoles = useMemo(() => {
    const start = safePage * rowsPerPage;

    return filteredRoles.slice(start, start + rowsPerPage);
  }, [filteredRoles, safePage, rowsPerPage]);

  // Open create dialog
  const openCreateDialog = () => {
    setEditingRole(null);
    setForm({ ...initialForm });
    setError("");

    setPermissionMatrix((previous) => ({
      ...previous,
      [DRAFT_ROLE_ID]: [],
    }));

    setOpen(true);
  };

  // Open edit dialog
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

  // Close dialog
  const closeDialog = () => {
    setOpen(false);
    setEditingRole(null);
    setForm({ ...initialForm });
    setError("");

    setPermissionMatrix((previous) => {
      const { [DRAFT_ROLE_ID]: removed, ...rest } = previous;
      return rest;
    });
  };

  // Update one permission
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

  // Select all active permissions
  const handleSelectAllPermissions = (
    roleId: number,
    checked: boolean,
  ) => {
    setPermissionMatrix((previous) => ({
      ...previous,
      [roleId]: checked ? [...activePermissionIds] : [],
    }));
  };

  // Save role
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

  // Delete role
  const handleDelete = () => {
    if (!deleteTarget) return;

    if ((deleteTarget._count?.users ?? 0) > 0) {
      setError("A role assigned to existing users cannot be deleted.");
      setDeleteTarget(null);
      return;
    }

    const deletedId = deleteTarget.id;

    setRoles((previous) =>
      previous.filter((role) => role.id !== deletedId),
    );

    setPermissionMatrix((previous) => {
      const { [deletedId]: removed, ...rest } = previous;
      return rest;
    });

    setDeleteTarget(null);
    setSuccess("Role deleted successfully.");

    const remainingCount = filteredRoles.length - 1;
    const lastPage = Math.max(
      0,
      Math.ceil(remainingCount / rowsPerPage) - 1,
    );

    setPage((currentPage) => Math.min(currentPage, lastPage));
  };

  // Refresh fake data
  const handleRefresh = () => {
    setRoles(initialRoles);

    setPermissionMatrix(
      createInitialRoleMatrix(initialRoles, initialPermissions),
    );

    setSearch("");
    setPage(0);
    setError("");
    setSuccess("Role data refreshed.");
  };

  // Update form fields
  const handleNameChange = (value: string) => {
    setForm((previous) => ({
      ...previous,
      name: value,
    }));
  };

  const handleCodeChange = (value: string) => {
    setForm((previous) => ({
      ...previous,
      code: value,
    }));
  };

  const handleStatusChange = (value: RoleStatus) => {
    setForm((previous) => ({
      ...previous,
      status: value,
    }));
  };

  // Matrix role for dialog
  const matrixRole = {
    id: editingRole?.id ?? DRAFT_ROLE_ID,
    name: form.name.trim() || "NEW ROLE",
  };

  return {
    // Data
    roles,
    permissionMatrix,
    activePermissionIds,
    filteredRoles,
    paginatedRoles,
    safePage,

    // Search
    search,
    setSearch,

    // Dialog
    open,
    editingRole,
    deleteTarget,
    setDeleteTarget,

    // Form
    form,
    setForm,
    matrixRole,

    // Notifications
    error,
    setError,
    success,
    setSuccess,

    // Pagination
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,

    // Actions
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
  };
}