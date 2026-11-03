"use client";

import { useState } from "react";

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

import "./login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setPasswordError("Invalid username/email or password");
        } else {
          setPasswordError(data.message || "Login failed");
        }
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);
      setPasswordError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
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

          {error && (
            <Typography color="error" sx={{ mt: 1, fontSize: 14 }}>
              {error}
            </Typography>
          )}

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
