"use client";

import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import "../app/globals.css";

type AppButtonProps = ButtonProps & {
  loading?: boolean;
};

export default function AppButton({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      className={`app-button ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}
