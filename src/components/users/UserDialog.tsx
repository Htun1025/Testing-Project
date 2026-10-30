"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { FormEvent } from "react";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

type UserForm = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type UserDialogProps = {
  open: boolean;
  editingUser: User | null;
  form: UserForm;
  onFormChange: (field: keyof UserForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function UserDialog({
  open,
  editingUser,
  form,
  onFormChange,
  onClose,
  onSubmit,
}: UserDialogProps) {
  const isEditing = editingUser !== null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit User" : "Create User"}

        <IconButton
          onClick={onClose}
          aria-label="Close dialog"
          sx={{ position: "absolute", right: 12, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(event) => onFormChange("name", event.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Username"
              value={form.username}
              onChange={(event) => onFormChange("username", event.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => onFormChange("email", event.target.value)}
              fullWidth
              required
            />

            {!isEditing && (
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) =>
                  onFormChange("password", event.target.value)
                }
                fullWidth
                required
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            {isEditing ? "Save Changes" : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
