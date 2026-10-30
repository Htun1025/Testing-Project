"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  emptyForm,
  type User,
  type UserForm,
} from "@/types";

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Smith",
    username: "johnsmith",
    email: "john@example.com",
    phone: "09123456789",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    username: "sarahjohnson",
    email: "sarah@example.com",
    phone: "09234567890",
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Brown",
    username: "michaelbrown",
    email: "michael@example.com",
    phone: "09345678901",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Emily Davis",
    username: "emilydavis",
    email: "emily@example.com",
    phone: "09456789012",
    status: "Active",
  },
];

export default function useUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>({ ...emptyForm });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [users, search]);

  const visibleUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  function openCreateDialog() {
    setEditingUser(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  }

  function openEditDialog(user: User) {
    setEditingUser(user);

    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });

    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingUser(null);
    setForm({ ...emptyForm });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedForm: UserForm = {
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    if (
      !cleanedForm.name ||
      !cleanedForm.username ||
      !cleanedForm.email ||
      !cleanedForm.phone
    ) {
      return;
    }

    if (editingUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...cleanedForm }
            : user,
        ),
      );
    } else {
      const newUser: User = {
        id: Date.now(),
        ...cleanedForm,
        status: "Active",
      };

      setUsers((previous) => [newUser, ...previous]);
      setPage(0);
    }

    closeDialog();
  }

  function handleDelete(user: User) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) return;

    setUsers((previous) =>
      previous.filter((item) => item.id !== user.id),
    );

    setPage(0);
  }

  // Receive a string value, not a React ChangeEvent.
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
    openCreateDialog,
    openEditDialog,
    closeDialog,
    handleSubmit,
    handleDelete,
    handleRowsPerPageChange,
  };
}