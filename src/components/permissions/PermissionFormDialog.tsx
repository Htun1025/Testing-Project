"use client";

import type { Permission } from "@/types";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import "@/app/globals.css";

export type PermissionForm = {
  name: string;
  module: string;
  action: string;
  description: string;
  status: "Active" | "Inactive";
};

interface PermissionFormDialogProps {
  open: boolean;
  editingPermission: Permission | null;
  form: PermissionForm;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: PermissionForm) => void;
}

export default function PermissionFormDialog({
  open,
  editingPermission,
  form,
  onClose,
  onSave,
  onFormChange,
}: PermissionFormDialogProps) {
  const updateField = <K extends keyof PermissionForm>(
    field: K,
    value: PermissionForm[K],
  ) => {
    onFormChange({
      ...form,
      [field]: value,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      className="form-dialog"
    >
      <DialogTitle className="form-dialog-title">
        {editingPermission ? "Edit Permission" : "Add New Permission"}
      </DialogTitle>

      <DialogContent className="form-dialog-content">
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            label="Permission Name"
            size="small"
            fullWidth
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />

          <TextField
            select
            label="Module"
            size="small"
            fullWidth
            value={form.module}
            onChange={(event) => updateField("module", event.target.value)}
          >
            {["User", "Role", "Dashboard", "Permission", "Settings"].map(
              (module) => (
                <MenuItem key={module} value={module}>
                  {module}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            select
            label="Action"
            size="small"
            fullWidth
            value={form.action}
            onChange={(event) => updateField("action", event.target.value)}
          >
            {["Create", "Read", "Update", "Delete", "Manage"].map((action) => (
              <MenuItem key={action} value={action}>
                {action}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />

          <TextField
            select
            label="Status"
            size="small"
            fullWidth
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as PermissionForm["status"],
              )
            }
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions className="form-dialog-actions">
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={!form.name.trim()}
        >
          {editingPermission ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
