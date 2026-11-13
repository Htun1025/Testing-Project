"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import AppButton from "@/components/AppButton";
import DeleteCard from "@/components/DeleteCard";
import ColumnSettings from "@/components/ColumnSetting";

import type { User, TableColumn } from "@/types";
import "@/app/globals.css";

type UserTableProps = {
  users: User[];
  totalCount: number;
  page: number;
  rowsPerPage: number;

  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;

  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: string) => void;

  showActions?: boolean;
  showColumnSettings?: boolean;
};

const columns = [
  { id: "id", label: "ID" },
  { id: "user", label: "name" },
  { id: "username", label: "username" },
  { id: "email", label: "email" },
  { id: "phone", label: "phone" },
  { id: "nrc", label: "nrc" },
  { id: "address", label: "address" },
  { id: "status", label: "status" },
] satisfies TableColumn[];

type ColumnId = (typeof columns)[number]["id"];

const STORAGE_KEY = "user-table-visible-columns";

const DEFAULT_COLUMNS: ColumnId[] = columns.map((column) => column.id);

export default function UserTable({
  users,
  totalCount,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
  showActions = true,
  showColumnSettings = true,
}: UserTableProps) {
  const t = useTranslations("Users");
  const common = useTranslations("Common");

  const [visibleColumns, setVisibleColumns] =
    useState<ColumnId[]>(DEFAULT_COLUMNS);

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteCard, setShowDeleteCard] = useState(false);

  // Load saved columns
  useEffect(() => {
    try {
      const savedColumns = localStorage.getItem(STORAGE_KEY);

      if (savedColumns !== null) {
        const parsed: unknown = JSON.parse(savedColumns);

        if (Array.isArray(parsed)) {
          const validColumns = parsed.filter(
            (id): id is ColumnId =>
              typeof id === "string" &&
              columns.some((column) => column.id === id),
          );

          setVisibleColumns(validColumns);
        }
      }
    } catch (error) {
      console.error("Failed to load columns:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Toggle columns
  const handleToggleColumn = (columnId: string) => {
    const selectedColumn = columns.find((column) => column.id === columnId);

    if (!selectedColumn) return;

    const updatedColumns = visibleColumns.includes(selectedColumn.id)
      ? visibleColumns.filter((id) => id !== selectedColumn.id)
      : [...visibleColumns, selectedColumn.id];

    setVisibleColumns(updatedColumns);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedColumns));
    } catch (error) {
      console.error("Failed to save columns:", error);
    }
  };

  // Delete handlers
  const handleDeleteClick = (user: User) => {
    if (!onDelete) return;

    setSelectedUser(user);
    setShowDeleteCard(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteCard(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser || !onDelete) return;

    onDelete(selectedUser);

    setShowDeleteCard(false);
    setSelectedUser(null);
  };

  // Render table cell
  const renderCell = (user: User, column: ColumnId) => {
    switch (column) {
      case "id":
        return user.id ?? "-";

      case "user":
        return user.name?.trim() || "-";

      case "username":
        return user.username?.trim() || "-";

      case "email":
        return user.email?.trim() || "-";

      case "phone":
        return user.phone?.trim() || "-";

      case "nrc":
        return user.nrc?.trim() || "-";

      case "address":
        return user.address?.trim() || "-";

      case "status":
        return (
          <Chip
            label={
              user.status === "ACTIVE"
                ? t("active")
                : user.status === "INACTIVE"
                  ? t("inactive")
                  : user.status || "-"
            }
            size="small"
            color={user.status === "ACTIVE" ? "success" : "default"}
            variant="outlined"
            className="user-status-chip"
          />
        );

      default:
        return "-";
    }
  };

  if (!isLoaded) {
    return null;
  }

  const visibleActionColumn = showActions && Boolean(onEdit || onDelete);
  const extraColumns = Number(visibleActionColumn) + Number(showColumnSettings);

  return (
    <Box className="table-wrapper">
      {/* Delete Confirmation */}
      {onDelete && (
        <DeleteCard
          open={showDeleteCard}
          title={t("deleteUserTitle")}
          message={t("deleteUserMessage")}
          itemName={selectedUser?.name}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* User Table */}
      <TableContainer className="table-container">
        <Table size="small" className="user-table">
          <TableHead>
            <TableRow>
              {columns
                .filter((column) => visibleColumns.includes(column.id))
                .map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "id" ? "ID" : t(column.label)}
                  </TableCell>
                ))}

              {visibleActionColumn && (
                <TableCell align="center" className="actions">
                  <Typography component="span" className="actions-label">
                    {t("actions")}
                  </Typography>
                </TableCell>
              )}

              {showColumnSettings && (
                <TableCell align="center" className="column-settings">
                  <ColumnSettings
                    columns={columns.map((column) => ({
                      ...column,
                      label: column.id === "id" ? "ID" : t(column.label),
                    }))}
                    visibleColumns={visibleColumns}
                    onToggle={handleToggleColumn}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(visibleColumns.length + extraColumns, 1)}
                  align="center"
                >
                  <Box className="empty-users">
                    <Typography color="text.secondary">
                      {t("noUsersFound")}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow hover key={user.id}>
                  {columns
                    .filter((column) => visibleColumns.includes(column.id))
                    .map((column) => (
                      <TableCell key={column.id}>
                        {renderCell(user, column.id)}
                      </TableCell>
                    ))}

                  {visibleActionColumn && (
                    <TableCell align="center" className="actions">
                      <Box className="action-buttons">
                        {onEdit && (
                          <Tooltip title={t("editUser")}>
                            <span>
                              <AppButton
                                color="primary"
                                size="small"
                                variant="text"
                                className="action-btn"
                                aria-label={t("editUser")}
                                onClick={() => onEdit(user)}
                              >
                                <EditOutlinedIcon className="action-icon" />
                              </AppButton>
                            </span>
                          </Tooltip>
                        )}

                        {onDelete && (
                          <Tooltip title={t("deleteUser")}>
                            <span>
                              <AppButton
                                color="error"
                                size="small"
                                variant="text"
                                className="action-btn"
                                aria-label={t("deleteUser")}
                                onClick={() => handleDeleteClick(user)}
                              >
                                <DeleteOutlineIcon className="action-icon" />
                              </AppButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}

                  {showColumnSettings && (
                    <TableCell className="column-settings" />
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        className="table-pagination"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(event.target.value)}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={common("rowsPerPage")}
      />
    </Box>
  );
}
