"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import DashboardHeader from "@/components/DashboardHeader";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login");

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setLoginError("");

    // Zod validation + Fake authentication
    const result = login(form.username, form.password, rememberMe);

    // Validation errors
    if (!result.success) {
      if (result.errors) {
        if (result.errors.identifier) {
          setUsernameError(t("usernameRequired"));
        }

        if (result.errors.password) {
          const passwordMessage = result.errors.password;

          setPasswordError(
            passwordMessage === "passwordRequired"
              ? t("passwordRequired")
              : t("passwordMinLength"),
          );
        }
      } else {
        setLoginError(
          result.message ===
            "Your account is inactive. Please contact administrator."
            ? t("accountInactive")
            : t("invalidCredentials"),
        );
      }

      return;
    }

    setLoading(true);

    router.push("/dashboard");
  }

  return (
    <Box className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <DashboardHeader showLanguageOnly />

      {/* Login Content */}
      <Box className="flex flex-1 items-center justify-center px-4 py-8">
        {/* Login Card */}
        <Box className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          {/* Logo */}
          <Box className="mb-5 flex justify-center">
            <Box className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950">
              <LockOutlinedIcon className="!text-3xl !text-blue-600 dark:!text-blue-400" />
            </Box>
          </Box>

          {/* Heading */}
          <Typography
            component="h1"
            className="!mb-2 !text-center !text-2xl !font-bold !text-gray-800 dark:!text-white"
          >
            {t("welcome")}
          </Typography>

          <Typography className="!mb-8 !text-center !text-sm !text-gray-500 dark:!text-gray-400">
            {t("subtitle")}
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Username */}
            <Box>
              <Typography className="!mb-2 !text-sm !font-semibold !text-gray-700 dark:!text-gray-300">
                {t("usernameLabel")}
              </Typography>

              <TextField
                fullWidth
                placeholder={t("usernamePlaceholder")}
                value={form.username}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));

                  setUsernameError("");
                  setLoginError("");
                }}
                error={Boolean(usernameError)}
                helperText={usernameError}
                autoComplete="username"
                disabled={loading}
                className="[&_input]:!text-sm [&_.MuiOutlinedInput-root]:!rounded-lg [&_.MuiOutlinedInput-root]:!bg-gray-50 dark:[&_.MuiOutlinedInput-root]:!bg-gray-800 [&_.MuiOutlinedInput-notchedOutline]:!border-gray-300 dark:[&_.MuiOutlinedInput-notchedOutline]:!border-gray-700"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon className="!text-gray-400" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography className="!mb-2 !text-sm !font-semibold !text-gray-700 dark:!text-gray-300">
                {t("passwordLabel")}
              </Typography>

              <TextField
                fullWidth
                placeholder={t("passwordPlaceholder")}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));

                  setPasswordError("");
                  setLoginError("");
                }}
                error={Boolean(passwordError)}
                helperText={passwordError}
                autoComplete="current-password"
                disabled={loading}
                className="[&_input]:!text-sm [&_.MuiOutlinedInput-root]:!rounded-lg [&_.MuiOutlinedInput-root]:!bg-gray-50 dark:[&_.MuiOutlinedInput-root]:!bg-gray-800 [&_.MuiOutlinedInput-notchedOutline]:!border-gray-300 dark:[&_.MuiOutlinedInput-notchedOutline]:!border-gray-700"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon className="!text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Login Error */}
            {loginError && (
              <Typography
                className="!text-sm !text-red-600 dark:!text-red-400"
                role="alert"
              >
                {loginError}
              </Typography>
            )}

            {/* Remember Me */}
            <Box className="flex flex-wrap items-center justify-between gap-2">
              <FormControlLabel
                className="!m-0"
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                }
                label={
                  <Typography className="!text-sm !text-gray-600 dark:!text-gray-400">
                    {t("rememberMe")}
                  </Typography>
                }
              />

              <Typography className="!cursor-pointer !text-sm !font-medium !text-blue-600 hover:!underline dark:!text-blue-400">
                {t("forgotPassword")}
              </Typography>
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="!rounded-lg !bg-blue-600 !py-3 !text-sm !font-semibold !normal-case !shadow-none hover:!bg-blue-700"
            >
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </Box>

          {/* Footer */}
          <Typography className="!mt-7 !text-center !text-sm !text-gray-500 dark:!text-gray-400">
            {t("noAccount")}{" "}
            <span className="!cursor-pointer !font-semibold !text-blue-600 dark:!text-blue-400">
              {t("contactAdmin")}
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
