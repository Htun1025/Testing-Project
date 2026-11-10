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
            {editingRole ? "Edit Role" : "Add New Role"}
          </Typography>

          <Typography className="role-dialog-subtitle">
            Configure role information and access permissions
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="form-dialog-content">
        <Stack spacing={1.5}>
          <Box className="role-form-section">
            <Typography className="role-section-title">
              Role Information
            </Typography>

            <Box className="role-form-grid">
              <TextField
                label="Role Name"
                required
                fullWidth
                size="small"
                placeholder="e.g. SUPERVISOR"
                value={form.name}
                onChange={(event) => onNameChange(event.target.value)}
                error={
                  form.name.length > 0 && form.name !== form.name.toUpperCase()
                }
                helperText={
                  form.name.length > 0 && form.name !== form.name.toUpperCase()
                    ? "Use uppercase letters."
                    : "Uppercase letters, numbers and underscores."
                }
              />

              <TextField
                label="Role Code"
                required
                fullWidth
                size="small"
                placeholder="e.g. SUPERVISOR"
                value={form.code}
                onChange={(event) => onCodeChange(event.target.value)}
                error={
                  form.code.length > 0 && form.code !== form.code.toUpperCase()
                }
                helperText={
                  form.code.length > 0 && form.code !== form.code.toUpperCase()
                    ? "Use uppercase letters."
                    : "Start with a letter; use uppercase and underscores."
                }
              />

              <TextField
                select
                label="Status"
                fullWidth
                size="small"
                value={form.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as RoleStatus)
                }
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Box className="role-matrix-section">
            <Box className="role-matrix-heading">
              <Box>
                <Typography className="role-section-title">
                  Role Permissions
                </Typography>

                <Typography className="role-matrix-description">
                  Select which permissions this role can access.
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
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={!form.name.trim() || !form.code.trim()}
        >
          {editingRole ? "Update Role" : "Save Role"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
