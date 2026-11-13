"use client";

import type { Permission } from "@/types";

import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { useTranslations } from "next-intl";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import DeleteCard from "../DeleteCard";
import "@/app/globals.css";
import { useState } from "react";

interface PermissionTableProps {
  permissions: Permission[];
  modules: string[];
  moduleFilter: string;
  onModuleFilterChange: (value: string) => void;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onEdit: (permission: Permission) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export default function PermissionTable({
  permissions,
  modules,
  moduleFilter,
  onModuleFilterChange,
  page,
  rowsPerPage,
  totalCount,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
}: PermissionTableProps) {
  const t = useTranslations("Permissions");
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      <Box className="table-toolbar">
        <Typography className="table-title">{t("allPermissions")}</Typography>

        <TextField
          select
          size="small"
          className="permission-module-filter"
          value={moduleFilter}
          onChange={(event) => {
            onModuleFilterChange(event.target.value);
            onPageChange(0);
          }}
          slotProps={{
            select: {
              MenuProps: {
                slotProps: {
                  paper: {
                    className: "permission-module-dropdown",
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="All">{t("allModules")}</MenuItem>

          {modules.map((module) => (
            <MenuItem key={module} value={module}>
              {t(`moduleNames.${module}`)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer className="table-container">
        <Table className="data-table">
          <TableHead>
            <TableRow>
              <TableCell>{t("permission").toUpperCase()}</TableCell>
              <TableCell>{t("module").toUpperCase()}</TableCell>
              <TableCell>{t("action").toUpperCase()}</TableCell>
              <TableCell>{t("description").toUpperCase()}</TableCell>
              <TableCell align="center">{t("status").toUpperCase()}</TableCell>
              <TableCell align="right">{t("actions").toUpperCase()}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography className="permission-empty">
                    {t("noPermissionsFound")}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography className="permission-name">
                      {item.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      className="permission-module-chip"
                      label={t(`moduleNames.${item.module}`)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography className="permission-cell">
                      {t(`actionNames.${item.action}`)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography className="permission-description">
                      {item.description || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      className={`permission-status ${item.status.toLowerCase()}`}
                      label={t(
                        item.status === "ACTIVE" ? "active" : "inactive",
                      )}
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
                        className="permission-action-button"
                        size="small"
                        title={t("editPermission")}
                        onClick={() => onEdit(item)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>

                      <IconButton
                        className="permission-action-button delete"
                        size="small"
                        title={t("deletePermission")}
                        onClick={() => setDeleteTarget(item)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
            minHeight: 42,
            fontSize: 12,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: 11,
            },
          "& .MuiTablePagination-select": {
            fontSize: 11,
          },
          "& .MuiIconButton-root": {
            padding: "4px",
          },
        }}
      />

      <DeleteCard
        open={Boolean(deleteTarget)}
        title={t("deletePermission")}
        message={t("deletePermissionMessage")}
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
