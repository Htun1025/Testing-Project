
"use client";

import { useEffect, useMemo, useState } from "react";

import type { User } from "@/types";
import { initialUsers } from "@/data/UserData";

const STORAGE_KEY = "fake-users";

export default function useDashboardUser() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // localStorage ထဲက User Data ဖတ်ရန်
  useEffect(() => {
    const loadUsers = () => {
      try {
        setError("");

        const savedUsers = localStorage.getItem(STORAGE_KEY);

        if (savedUsers) {
          setUsers(JSON.parse(savedUsers) as User[]);
        } else {
          setUsers(initialUsers);
        }
      } catch (err) {
        console.error("Dashboard users error:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();

    // အခြား browser tab မှာ Data ပြောင်းလဲပါက Update လုပ်ရန်
    window.addEventListener("storage", loadUsers);

    return () => {
      window.removeEventListener("storage", loadUsers);
    };
  }, []);

  // User Statistics
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "ACTIVE",
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "INACTIVE",
  ).length;

  // User Growth - User ID အလိုက်
  const growthData = useMemo(() => {
    const sortedUsers = [...users].sort(
      (a, b) => a.id - b.id,
    );

    return sortedUsers.map((user, index) => ({
      userId: `User ${user.id}`,
      users: index + 1,
    }));
  }, [users]);

  // Total Users
  const totalNewUsers = totalUsers;

  return {
    users,
    loading,
    error,
    totalUsers,
    activeUsers,
    inactiveUsers,
    growthData,
    totalNewUsers,
  };
}
