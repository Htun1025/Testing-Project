"use client";

import { useMemo, useState } from "react";
import type { SyntheticEvent } from "react";

import type { Role, Permission ,PermissionForm } from "@/types";

import { initialRoles } from "@/data/RoleData";
import { initialPermissions } from "@/data/PermissionData";

import {
  createInitialMatrix,
  defaultForm,
} from "@/utils/permissionUtils";

export default function usePermissions() {
  // Roles
  const [roles] = useState<Role[]>(initialRoles);

  // Permissions
  const [permissions, setPermissions] =
    useState<Permission[]>(initialPermissions);

  // Role permission matrix
  const [matrix, setMatrix] = useState<Record<number, number[]>>(() =>
    createInitialMatrix(initialRoles, initialPermissions),
  );

  // Tabs
  const [tab, setTab] = useState(0);

  // Search and filter
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog
  const [open, setOpen] = useState(false);

  const [editingPermission, setEditingPermission] =
    useState<Permission | null>(null);

  const [form, setForm] = useState<PermissionForm>({
    ...defaultForm,
  });

  // Available modules
  const modules = useMemo(
    () => [...new Set(permissions.map((item) => item.module))],
    [permissions],
  );

  // Active permission IDs
  const activePermissionIds = useMemo(
    () =>
      permissions
        .filter((item) => item.status === "ACTIVE")
        .map((item) => item.id),
    [permissions],
  );

  // Search and module filter
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

  // Open create dialog
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

  // Close dialog
  const closeDialog = () => {
    setOpen(false);
    setEditingPermission(null);
    setForm({ ...defaultForm });
  };

  // Save permission
  const handleSave = () => {
    const name = form.name.trim();

    if (!name) return;

    if (editingPermission) {
      setPermissions((previous) =>
        previous.map((item) =>
          item.id === editingPermission.id
            ? { ...item, ...form, name }
            : item,
        ),
      );
    } else {
      const newPermission: Permission = {
        id: Math.max(0, ...permissions.map((item) => item.id)) + 1,
        ...form,
        name,
      };

      setPermissions((previous) => [...previous, newPermission]);

      setPage(Math.floor(permissions.length / rowsPerPage));
    }

    closeDialog();
  };

  // Delete permission
  const handleDelete = (id: number) => {
    const updatedPermissions = permissions.filter((item) => item.id !== id);

    setPermissions(updatedPermissions);

    // Calculate filtered count after deletion
    const filteredCount = updatedPermissions.filter((item) => {
      const searchText =
        `${item.name} ${item.module} ${item.action} ${item.description}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesModule =
        moduleFilter === "All" || item.module === moduleFilter;

      return matchesSearch && matchesModule;
    }).length;

    const lastPage = Math.max(
      0,
      Math.ceil(filteredCount / rowsPerPage) - 1,
    );

    setPage((current) => Math.min(current, lastPage));

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

  // Change tab
  const handleTabChange = (
    _: SyntheticEvent,
    newValue: number,
  ) => {
    setTab(newValue);
    setSearch("");
    setModuleFilter("All");
    setPage(0);
  };

  // Return states and functions to page.tsx
  return {
    roles,
    permissions,
    matrix,

    tab,
    setTab,

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
  };
}