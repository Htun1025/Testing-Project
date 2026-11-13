
"use client";

import { useEffect, useState } from "react";

import { initialLoginUsers } from "@/data/UserData";
import type { FakeLoginUser, User } from "@/types";
import { loginSchema } from "@/schemas/auth.schema";

type AuthUser = Omit<FakeLoginUser, "password">;

type UserCredential = {
  id: number;
  username: string;
  email: string;
  password: string;
};

type LoginResult =
  | {
      success: true;
      message: string;
      user: AuthUser;
      errors: null;
    }
  | {
      success: false;
      message: string;
      user: null;
      errors?: {
        identifier?: string;
        password?: string;
      };
    };

const AUTH_KEY = "fake-auth-user";
const USERS_KEY = "fake-users";
const CREDENTIALS_KEY = "fake-user-credentials";

export default function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load Auth User
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

  // Login with Zod Validation
  const login = (
    identifier: string,
    password: string,
    rememberMe = false,
  ): LoginResult => {
    const validation = loginSchema.safeParse({
      identifier,
      password,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      return {
        success: false,
        message: "Please check your login information.",
        user: null,
        errors: {
          identifier: fieldErrors.identifier?.[0],
          password: fieldErrors.password?.[0],
        },
      };
    }

    const {
      identifier: validIdentifier,
      password: validPassword,
    } = validation.data;

    const normalizedIdentifier = validIdentifier.toLowerCase();

    // 1. မူလ Fake Login Users ကိုစစ်ခြင်း
    const initialUser = initialLoginUsers.find(
      (item) =>
        (item.username.toLowerCase() === normalizedIdentifier ||
          item.email.toLowerCase() === normalizedIdentifier) &&
        item.password === validPassword,
    );

    // 2. User Form မှ Add လုပ်ထားသော Users ကိုဖတ်ခြင်း
    let addedUser: User | undefined;
    let addedCredential: UserCredential | undefined;

    try {
      const savedUsers = localStorage.getItem(USERS_KEY);
      const savedCredentials = localStorage.getItem(CREDENTIALS_KEY);

      const users: User[] = savedUsers
        ? (JSON.parse(savedUsers) as User[])
        : [];

      const credentials: UserCredential[] = savedCredentials
        ? (JSON.parse(savedCredentials) as UserCredential[])
        : [];

      addedCredential = credentials.find(
        (item) =>
          (item.username.toLowerCase() === normalizedIdentifier ||
            item.email.toLowerCase() === normalizedIdentifier) &&
          item.password === validPassword,
      );

      if (addedCredential) {
        addedUser = users.find(
          (item) => item.id === addedCredential?.id,
        );
      }
    } catch (error) {
      console.error("Failed to read added users:", error);

      return {
        success: false,
        message: "Unable to read user information.",
        user: null,
      };
    }

    // Initial User သို့မဟုတ် Added User
    const foundUser: FakeLoginUser | undefined = initialUser
      ? initialUser
      : addedUser && addedCredential
        ? {
            id: addedUser.id,
            name: addedUser.name,
            username: addedUser.username,
            email: addedUser.email,
            password: validPassword,
            phone: addedUser.phone,
            nrc: addedUser.nrc,
            address: addedUser.address,
            status: addedUser.status,
            role: addedUser.role,
          }
        : undefined;

    // User မတွေ့ပါက
    if (!foundUser) {
      return {
        success: false,
        message: "Invalid username/email or password.",
        user: null,
      };
    }

    // Check Account Status
    if (foundUser.status !== "ACTIVE") {
      return {
        success: false,
        message: "Your account is inactive. Please contact administrator.",
        user: null,
      };
    }

    // Remove Password
    const { password: _password, ...safeUser } = foundUser;

    try {
      if (rememberMe) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
        sessionStorage.removeItem(AUTH_KEY);
      } else {
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
        localStorage.removeItem(AUTH_KEY);
      }

      setUser(safeUser);

      return {
        success: true,
        message: "Login successful.",
        user: safeUser,
        errors: null,
      };
    } catch (error) {
      console.error("Failed to save auth user:", error);

      return {
        success: false,
        message: "Unable to save login session.",
        user: null,
      };
    }
  };

  // Logout
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
