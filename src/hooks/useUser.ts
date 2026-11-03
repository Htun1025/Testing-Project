
"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  emptyForm,
  type User,
  type UserForm,
} from "@/types";

export default function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ ...emptyForm });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users
  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(Array.isArray(data) ? data : data.users ?? []);
    } catch (err) {
      console.error("Fetch users error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load users",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUsers();
  }, []);

  // Search
  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) =>
      [
        user.name,
        user.username,
        user.email,
        user.phone,
        user.status,
        user.address,
        user.nrc,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(keyword),
      ),
    );
  }, [users, search]);

  // Pagination
  const visibleUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Open Create Dialog
  function openCreateDialog() {
    setEditingUser(null);
    setForm({ ...emptyForm });
    setError("");
    setDialogOpen(true);
  }

  // Open Edit Dialog
  function openEditDialog(user: User) {
    setEditingUser(user);

    setForm({
      ...emptyForm,
      name: user.name ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      nrc: user.nrc ?? "",
      address: user.address ?? "",
      status: user.status ?? "",
      password: "",
    });

    setError("");
    setDialogOpen(true);
  }

  // Close Dialog
  function closeDialog() {
    setDialogOpen(false);
    setEditingUser(null);
    setForm({ ...emptyForm });
    setError("");
  }

  // Create / Update User
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: (form.password ?? "").trim(),
      phone: form.phone.trim(),
      nrc: form.nrc.trim(),
      address: form.address.trim(),
    };

    if (
      !cleanedForm.name ||
      !cleanedForm.username ||
      !cleanedForm.email ||
      (!editingUser && !cleanedForm.password) ||
      !cleanedForm.phone ||
      !cleanedForm.nrc ||
      !cleanedForm.address ||
      !cleanedForm.status
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const isEditing = editingUser !== null;

      const url = isEditing
        ? `/api/admin/users/${editingUser.id}`
        : "/api/admin/users";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isEditing
            ? {
                name: cleanedForm.name,
                username: cleanedForm.username,
                email: cleanedForm.email,
                phone: cleanedForm.phone,
                nrc: cleanedForm.nrc,
                address: cleanedForm.address,
                status: cleanedForm.status,
              }
            : cleanedForm,
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save user");
      }

      await fetchUsers();

      setPage(0);
      closeDialog();
    } catch (err) {
      console.error("Save user error:", err);

      setError(
        err instanceof Error ? err.message : "Failed to save user",
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete User
  function handleDelete(user: User) {
    console.log("Delete API not connected:", user.id);
    setError("Delete API is not connected yet.");
  }

  function handleRowsPerPageChange(value: string) {
    setRowsPerPage(Number(value));
    setPage(0);
  }

  return {
    users,
    filteredUsers,
    visibleUsers,

    search,
    setSearch,

    dialogOpen,
    editingUser,
    form,
    setForm,

    page,
    setPage,
    rowsPerPage,

    loading,
    error,

    fetchUsers,
    openCreateDialog,
    openEditDialog,
    closeDialog,

    handleSubmit,
    handleDelete,
    handleRowsPerPageChange,
  };
}
