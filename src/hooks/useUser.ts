
"use client";

import { useEffect, useMemo, useState } from "react";

import type { User, UserForm } from "@/types";
import { initialUsers } from "@/data/UserData";
import { userSchema } from "@/schemas/user.schema";

const STORAGE_KEY = "fake-users";
const CREDENTIALS_KEY = "fake-user-credentials";

type UserCredential = {
  id: number;
  username: string;
  email: string;
  password: string;
};

const emptyForm: UserForm = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  nrc: "",
  address: "",
  status: "ACTIVE",
};

export default function useUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load users
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

  // Save users
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  }, [users, isLoaded]);

  // Read credentials
  const getCredentials = (): UserCredential[] => {
    try {
      const saved = localStorage.getItem(CREDENTIALS_KEY);
      return saved ? (JSON.parse(saved) as UserCredential[]) : [];
    } catch (error) {
      console.error("Failed to read credentials:", error);
      return [];
    }
  };

  // Save credentials
  const saveCredentials = (credentials: UserCredential[]) => {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  };

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
    const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;

    const createdUser = {
      ...newUser,
      id: nextId,
    };

    setUsers((previous) => [...previous, createdUser]);
    setPage(0);

    return createdUser;
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

    // ဖျက်လိုက်တဲ့ User ရဲ့ Login credentials ကိုပါ ဖျက်ခြင်း
    const credentials = getCredentials().filter(
      (item) => item.id !== target.id,
    );

    saveCredentials(credentials);

    setPage((currentPage) => {
      const remainingCount = filteredUsers.length - 1;
      const maxPage = Math.max(
        0,
        Math.ceil(remainingCount / rowsPerPage) - 1,
      );

      return Math.min(currentPage, maxPage);
    });
  };

  // Submit Create / Edit Form
  const handleSubmit = () => {
    setError("");
    setLoading(true);

    try {
      const result = userSchema.safeParse(form);

      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Invalid form data.");
        return;
      }

      const validatedData = result.data;

      // Duplicate username / email check
      const duplicate = users.some(
        (user) =>
          user.id !== editingUser?.id &&
          (user.username.toLowerCase() ===
            validatedData.username.toLowerCase() ||
            user.email.toLowerCase() ===
              validatedData.email.toLowerCase()),
      );

      if (duplicate) {
        setError("Username or email already exists.");
        return;
      }

      const credentials = getCredentials();

      // User data မှ Password ကို ခွဲထုတ်ခြင်း
      const { password, ...userData } = validatedData;

      const normalizedUserData = {
        ...userData,
        phone: userData.phone ?? "",
        address: userData.address ?? "",
      };

      if (editingUser) {
        const updatedUser: User = {
          ...editingUser,
          ...normalizedUserData,
        };

        handleEdit(updatedUser);

        // Password အသစ်ထည့်ထားမှသာ ပြောင်းမယ်
        if (password?.trim()) {
          const existingIndex = credentials.findIndex(
            (item) => item.id === editingUser.id,
          );

          if (existingIndex >= 0) {
            credentials[existingIndex] = {
              ...credentials[existingIndex],
              username: updatedUser.username,
              email: updatedUser.email,
              password,
            };
          } else {
            credentials.push({
              id: editingUser.id,
              username: updatedUser.username,
              email: updatedUser.email,
              password,
            });
          }
        } else {
          // Password မပြောင်းလျှင် username/email ကို update လုပ်မယ်
          const existing = credentials.find(
            (item) => item.id === editingUser.id,
          );

          if (existing) {
            existing.username = updatedUser.username;
            existing.email = updatedUser.email;
          }
        }

        saveCredentials(credentials);
      } else {
        const newUser: User = {
          id: 0,
          ...normalizedUserData,
          role: "USER",
        };

        const createdUser = handleAdd(newUser);

        // User အသစ်အတွက် Login credentials သိမ်းခြင်း
        if (password?.trim()) {
          credentials.push({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            password,
          });

          saveCredentials(credentials);
        }
      }

      closeDialog();
    } catch (error) {
      console.error("User submission failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
