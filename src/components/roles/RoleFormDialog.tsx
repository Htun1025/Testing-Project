"use client";

import type { RoleForm, RoleStatus } from "@/types";
import { initialPermissions } from "@/data/PermissionData";
import PermissionMatrix from "@/components/PermissionMatrix";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useTranslations } from "next-intl";
import "@/app/globals.css";

type MatrixRole = {
  id: number;
  name: string;
};

type RoleFormDialogProps = {
  open: boolean;
  editingRole: boolean;
  form: RoleForm;
  error: string;
  matrixRole: MatrixRole;
  permissionMatrix: Record<number, number[]>;
  activePermissionIds: number[];
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onStatusChange: (value: RoleStatus) => void;
  onPermissionToggle: (
    roleId: number,
    permissionId: number,
    checked: boolean,
  ) => void;
  onSelectAll: (roleId: number, checked: boolean) => void;
};

export default function RoleFormDialog({
  open,
  editingRole,
  form,
  error,
  matrixRole,
  permissionMatrix,
  activePermissionIds,
  onClose,
  onSave,
  onNameChange,
  onCodeChange,
  onStatusChange,
  onPermissionToggle,
  onSelectAll,
}: RoleFormDialogProps) {
  const t = useTranslations("Roles");

  const nameInvalid =
    form.name.length > 0 && form.name !== form.name.toUpperCase();

  const codeInvalid =
    form.code.length > 0 && form.code !== form.code.toUpperCase();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
      className="form-dialog"
    >
      <DialogTitle className="form-dialog-title">
        <Box>
          <Typography className="role-dialog-heading">
            {editingRole ? t("editRole") : t("addNewRole")}
          </Typography>

          <Typography className="role-dialog-subtitle">
            {t("roleDialogSubtitle")}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="form-dialog-content">
        <Stack spacing={1.5}>
          <Box className="role-form-section">
            <Typography className="role-section-title">
              {t("roleInformation")}
            </Typography>

            <Box className="role-form-grid">
              <TextField
                label={t("roleName")}
                required
                fullWidth
                size="small"
                placeholder={t("roleNamePlaceholder")}
                value={form.name}
                onChange={(event) => onNameChange(event.target.value)}
                error={nameInvalid}
                helperText={
                  nameInvalid ? t("uppercaseOnly") : t("roleNameHelper")
                }
              />

              <TextField
                label={t("roleCode")}
                required
                fullWidth
                size="small"
                placeholder={t("roleCodePlaceholder")}
                value={form.code}
                onChange={(event) => onCodeChange(event.target.value)}
                error={codeInvalid}
                helperText={
                  codeInvalid ? t("uppercaseOnly") : t("roleCodeHelper")
                }
              />

              <TextField
                select
                label={t("status")}
                fullWidth
                size="small"
                value={form.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as RoleStatus)
                }
              >
                <MenuItem value="ACTIVE">{t("active")}</MenuItem>
                <MenuItem value="INACTIVE">{t("inactive")}</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Box className="role-matrix-section">
            <Box className="role-matrix-heading">
              <Box>
                <Typography className="role-section-title">
                  {t("rolePermissions")}
                </Typography>

                <Typography className="role-matrix-description">
                  {t("rolePermissionsDescription")}
                </Typography>
              </Box>
            </Box>

            <Box className="role-matrix-container">
              <PermissionMatrix
                roles={[matrixRole]}
                permissions={initialPermissions}
                matrix={permissionMatrix}
                activePermissionIds={activePermissionIds}
                onPermissionToggle={onPermissionToggle}
                onSelectAll={onSelectAll}
              />
            </Box>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions className="form-dialog-actions">
        <Button onClick={onClose} color="inherit">
          {t("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={!form.name.trim() || !form.code.trim()}
        >
          {editingRole ? t("updateRole") : t("saveRole")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
