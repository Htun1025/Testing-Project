"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import AppButton from "@/components/AppButton";
import "@/app/globals.css";

type GlobalDeleteCardProps = {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function GlobalDeleteCard({
  open,
  title = "Delete User",
  message = "Are you sure you want to delete this user?",
  itemName,
  loading = false,
  onCancel,
  onConfirm,
}: GlobalDeleteCardProps) {
  if (!open) return null;

  return (
    <Box className="delete-card-overlay" role="presentation">
      <Card
        className="global-delete-card"
        elevation={0}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-card-title"
      >
        <CardContent>
          <Box className="global-delete-icon">
            <WarningAmberRoundedIcon />
          </Box>

          <Typography id="delete-card-title" className="global-delete-title">
            {title}
          </Typography>

          <Typography className="global-delete-message">{message}</Typography>

          {itemName && (
            <Typography className="global-delete-item">{itemName}</Typography>
          )}

          <Box className="global-delete-actions">
            <AppButton
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </AppButton>

            <AppButton
              variant="contained"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AppButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
