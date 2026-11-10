"use client";

import { useEffect, useState } from "react";
import {
  initialLoginUsers,
} from "@/data/UserData";
import type { FakeLoginUser } from "@/types";

type AuthUser = Omit<FakeLoginUser, "password">;

const AUTH_KEY = "fake-auth-user";

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(AUTH_KEY) ??
        sessionStorage.getItem(AUTH_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser) as AuthUser);
      }
    } catch (error) {
      console.error("Failed to load auth user:", error);
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(AUTH_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (identifier: string, password: string) => {
    const foundUser = initialLoginUsers.find(
      (item) =>
        (item.username.toLowerCase() === identifier.toLowerCase() ||
          item.email.toLowerCase() === identifier.toLowerCase()) &&
        item.password === password &&
        item.status === "Active",
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid username/email or password.",
      };
    }

    const { password: _, ...safeUser } = foundUser;

    setUser(safeUser);

    return {
      success: true,
      message: "Login successful.",
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
}