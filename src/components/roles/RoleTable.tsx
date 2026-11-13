"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Role } from "@/types";

import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import DeleteCard from "../DeleteCard";
import "@/app/globals.css";

interface RoleTableProps {
  roles: Role[];
  permissionMatrix: Record<number, number[]>;
  activePermissionIds: number[];

  page: number;
  rowsPerPage: number;
  totalCount: number;

  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onRefresh: () => void;

  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export default function RoleTable({
  roles,
  permissionMatrix,
  activePermissionIds,
  page,
  rowsPerPage,
  totalCount,
  onEdit,
  onDelete,
  onRefresh,
  onPageChange,
  onRowsPerPageChange,
}: RoleTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const t = useTranslations("Roles");

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    onDelete(deleteTarget);
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <>
      <Paper className="table-card" elevation={0}>
        {/* TABLE TOOLBAR */}
        <Box className="table-toolbar">
          <Typography className="table-title">{t("allRoles")}</Typography>

          <Button size="small" onClick={onRefresh} className="refresh">
            {t("refresh")}
          </Button>
        </Box>

        {/* TABLE */}
        <TableContainer>
          <Table className="data-table" size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("roleName").toUpperCase()}</TableCell>
                <TableCell>{t("roleCode").toUpperCase()}</TableCell>
                <TableCell align="center">{t("users").toUpperCase()}</TableCell>
                <TableCell align="center">
                  {t("permissions").toUpperCase()}
                </TableCell>
                <TableCell align="center">
                  {t("status").toUpperCase()}
                </TableCell>
                <TableCell align="right">
                  {t("actions").toUpperCase()}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography sx={{ py: 3, fontSize: 12 }}>
                      {t("noRolesFound")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <Typography className="role-field">
                        {role.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={role.code}
                        size="small"
                        className="role-code-chip"
                      />
                    </TableCell>

                    <TableCell align="center">
                      {role._count?.users ?? 0}
                    </TableCell>

                    <TableCell align="center">
                      {
                        (permissionMatrix[role.id] ?? []).filter((id) =>
                          activePermissionIds.includes(id),
                        ).length
                      }
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        className={`role-status ${role.status.toLowerCase()}`}
                        label={
                          role.status === "ACTIVE" ? t("active") : t("inactive")
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <IconButton
                          className="role-action-button"
                          size="small"
                          onClick={() => onEdit(role)}
                          title={t("editRole")}
                          aria-label={t("editRole")}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          className="role-action-button delete"
                          size="small"
                          onClick={() => setDeleteTarget(role)}
                          title={t("deleteRole")}
                          aria-label={t("deleteRole")}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            onRowsPerPageChange(Number(event.target.value))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage={t("rowsPerPage")}
          sx={{
            borderTop: "1px solid var(--border-color, #e2e8f0)",
            "& .MuiTablePagination-toolbar": {
              minHeight: 38,
              fontSize: 11,
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontSize: 10,
              },
            "& .MuiTablePagination-select": {
              fontSize: 10,
            },
            "& .MuiIconButton-root": {
              padding: "4px",
            },
          }}
        />
      </Paper>

      {/* DELETE CARD */}
      <DeleteCard
        open={Boolean(deleteTarget)}
        title={t("deleteRole")}
        message={t("deleteRoleMessage")}
        itemName={deleteTarget?.name}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
