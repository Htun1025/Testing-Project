"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

import { initialLoginUsers } from "@/data/UserData";

import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUsernameError("");
    setPasswordError("");

    const identifier = form.username.trim();
    const password = form.password;

    let hasError = false;

    if (!identifier) {
      setUsernameError("Username or Email is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const foundUser = initialLoginUsers.find(
      (user) =>
        (user.username.toLowerCase() === identifier.toLowerCase() ||
          user.email.toLowerCase() === identifier.toLowerCase()) &&
        user.password === password &&
        user.status === "Active",
    );

    if (!foundUser) {
      setPasswordError("Invalid username/email or password");
      setLoading(false);
      return;
    }

    // Password မပါသော user data ကို သိမ်းမယ်
    const { password: _, ...safeUser } = foundUser;

    // Remember Me ရွေးထားရင် localStorage၊ မရွေးရင် sessionStorage
    const storage = rememberMe ? localStorage : sessionStorage;

    // Login data သိမ်းမယ်
    localStorage.removeItem("fake-auth-user");
    sessionStorage.removeItem("fake-auth-user");

    storage.setItem("fake-auth-user", JSON.stringify(safeUser));

    // Dashboard သို့သွားမယ်
    router.push("/dashboard");
  }

  return (
    <Box className="login-page">
      <Box className="login-card">
        <Box className="login-logo">
          <LockOutlinedIcon />
        </Box>

        <Typography component="h1" className="login-title">
          Welcome Back!
        </Typography>

        <Typography className="login-subtitle">
          Please enter your username and password to sign in.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          className="login-form"
          noValidate
        >
          <Typography className="input-label">Username or Email</Typography>

          <TextField
            fullWidth
            placeholder="Enter your username or email"
            value={form.username}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                username: e.target.value,
              }));
              setUsernameError("");
            }}
            error={Boolean(usernameError)}
            helperText={usernameError}
            autoComplete="username"
            className="login-input"
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Typography className="input-label">Password</Typography>

          <TextField
            fullWidth
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }));
              setPasswordError("");
            }}
            error={Boolean(passwordError)}
            helperText={passwordError}
            autoComplete="current-password"
            className="login-input"
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
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

          <Box className="login-options">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Remember me"
            />

            <Typography className="forgot-password">
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>

        <Typography className="login-footer">
          Don't have an account? <span>Contact administrator</span>
        </Typography>
      </Box>
    </Box>
  );
}
