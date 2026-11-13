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
import { useTranslations } from "next-intl";
import "@/app/globals.css";

export type PermissionForm = {
  name: string;
  module: string;
  action: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
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
  const t = useTranslations("Permissions");

  const updateField = <K extends keyof PermissionForm>(
    field: K,
    value: PermissionForm[K],
  ) => {
    onFormChange({
      ...form,
      [field]: value,
    });
  };

  const modules = ["User", "Role", "Dashboard", "Permission", "Settings"];
  const actions = ["Create", "Read", "Update", "Delete", "Manage"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      className="form-dialog"
    >
      <DialogTitle className="form-dialog-title">
        {editingPermission ? t("editPermission") : t("addNewPermission")}
      </DialogTitle>

      <DialogContent className="form-dialog-content">
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            label={t("permissionName")}
            size="small"
            fullWidth
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />

          <TextField
            select
            label={t("module")}
            size="small"
            fullWidth
            value={form.module}
            onChange={(event) => updateField("module", event.target.value)}
          >
            {modules.map((module) => (
              <MenuItem key={module} value={module}>
                {t(`moduleNames.${module}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={t("action")}
            size="small"
            fullWidth
            value={form.action}
            onChange={(event) => updateField("action", event.target.value)}
          >
            {actions.map((action) => (
              <MenuItem key={action} value={action}>
                {t(`actionNames.${action}`)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t("description")}
            size="small"
            fullWidth
            multiline
            rows={2}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />

          <TextField
            select
            label={t("status")}
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
            <MenuItem value="ACTIVE">{t("active")}</MenuItem>
            <MenuItem value="INACTIVE">{t("inactive")}</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions className="form-dialog-actions">
        <Button color="inherit" onClick={onClose}>
          {t("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={!form.name.trim()}
        >
          {editingPermission ? t("update") : t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
