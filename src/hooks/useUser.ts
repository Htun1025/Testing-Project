
"use client";

import { useEffect, useMemo, useState } from "react";

import type { User, UserForm } from "@/types";
import { initialUsers } from "@/data/UserData";

const STORAGE_KEY = "fake-users";

const emptyForm: UserForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  nrc: "",
  address: "",
  status: "Active",
};

export default function useUsers() {
  // User data
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Search and pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Fake Data from localStorage
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEY);

      if (savedUsers) {
        setUsers(JSON.parse(savedUsers) as User[]);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save Fake Data to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  }, [users, isLoaded]);

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
        user.nrc,
        user.address,
        user.status,
        user.role,
      ].some((value) => value?.toLowerCase().includes(keyword)),
    );
  }, [users, search]);

  // Pagination
  const paginatedUsers = useMemo(() => {
    const start = page * rowsPerPage;

    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  // Open Create Dialog
  const openCreateDialog = () => {
    setEditingUser(null);
    setForm({ ...emptyForm });
    setError("");
    setDialogOpen(true);
  };

  // Open Edit Dialog
  const openEditDialog = (user: User) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: "",
      nrc: user.nrc,
      address: user.address,
      status: user.status,
    });

    setError("");
    setDialogOpen(true);
  };

  // Close Dialog
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setForm({ ...emptyForm });
    setError("");
  };

  // Add User
  const handleAdd = (newUser: User) => {
    setUsers((previous) => [
      ...previous,
      {
        ...newUser,
        id: Math.max(0, ...previous.map((user) => user.id)) + 1,
      },
    ]);

    setPage(0);
  };

  // Edit User
  const handleEdit = (updatedUser: User) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === updatedUser.id ? updatedUser : user,
      ),
    );
  };

  // Delete User
  const handleDelete = (target: User) => {
    setUsers((previous) =>
      previous.filter((user) => user.id !== target.id),
    );
  };

  // Submit Create / Edit Form
  const handleSubmit = () => {
    setError("");

    const name = form.name.trim();
    const username = form.username.trim();
    const email = form.email.trim();

    if (!name || !username || !email) {
      setError("Please fill in all required fields.");
      return;
    }

    // Check duplicate username and email
    const duplicate = users.some(
      (user) =>
        user.id !== editingUser?.id &&
        (user.username.toLowerCase() === username.toLowerCase() ||
          user.email.toLowerCase() === email.toLowerCase()),
    );

    if (duplicate) {
      setError("Username or email already exists.");
      return;
    }

    setLoading(true);

    // Password ကို User table ထဲ မသိမ်းပါ
    const { password: _password, ...userData } = form;

    if (editingUser) {
      handleEdit({
        ...editingUser,
        ...userData,
      });
    } else {
      const newUser: User = {
        id: 0,
        ...userData,
        role: "USER",
      };

      handleAdd(newUser);
    }

    setLoading(false);
    closeDialog();
  };

  return {
    users,
    filteredUsers,
    paginatedUsers,

    search,
    setSearch,

    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,

    form,
    setForm,

    dialogOpen,
    editingUser,
    openCreateDialog,
    openEditDialog,
    closeDialog,

    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,

    error,
    loading,
    isLoaded,
  };
}
