"use client";

import { useEffect, useState } from "react";

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
import "@/app/(menu)/user/user.css";

type UserTableProps = {
  users: User[];
  totalCount: number;
  page: number;
  rowsPerPage: number;

  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;

  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: string) => void;

  // UI Settings
  showActions?: boolean;
  showColumnSettings?: boolean;
};

const columns = [
  { id: "id", label: "ID" },
  { id: "user", label: "User" },
  { id: "username", label: "Username" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "nrc", label: "NRC" },
  { id: "address", label: "Address" },
  { id: "status", label: "Status" },
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
            label={user.status || "-"}
            size="small"
            color={user.status === "Active" ? "success" : "default"}
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
    <Box className="user-table-wrapper">
      {/* Delete Confirmation */}
      {onDelete && (
        <DeleteCard
          open={showDeleteCard}
          title="Delete User?"
          message="Are you sure you want to delete this user?"
          itemName={selectedUser?.name}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* User Table */}
      <TableContainer className="user-table-container">
        <Table size="small" className="user-table">
          {/* Table Header */}
          <TableHead>
            <TableRow>
              {columns
                .filter((column) => visibleColumns.includes(column.id))
                .map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}

              {/* Actions Header */}
              {visibleActionColumn && (
                <TableCell align="center" className="user-actions">
                  <Typography component="span" className="actions-label">
                    Actions
                  </Typography>
                </TableCell>
              )}

              {/* Column Settings Header */}
              {showColumnSettings && (
                <TableCell align="center" className="user-column-settings">
                  <ColumnSettings
                    columns={columns}
                    visibleColumns={visibleColumns}
                    onToggle={handleToggleColumn}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={Math.max(visibleColumns.length + extraColumns, 1)}
                  align="center"
                >
                  <Box className="empty-users">
                    <Typography color="text.secondary">
                      No users found.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow hover key={user.id}>
                  {/* User Information */}
                  {columns
                    .filter((column) => visibleColumns.includes(column.id))
                    .map((column) => (
                      <TableCell key={column.id}>
                        {renderCell(user, column.id)}
                      </TableCell>
                    ))}

                  {/* Actions */}
                  {visibleActionColumn && (
                    <TableCell align="center" className="user-actions">
                      <Box className="user-action-buttons">
                        {/* Edit */}
                        {onEdit && (
                          <Tooltip title="Edit user">
                            <span>
                              <AppButton
                                color="primary"
                                size="small"
                                variant="text"
                                className="user-action-btn"
                                aria-label={`Edit ${user.name}`}
                                onClick={() => onEdit(user)}
                              >
                                <EditOutlinedIcon className="user-action-icon" />
                              </AppButton>
                            </span>
                          </Tooltip>
                        )}

                        {/* Delete */}
                        {onDelete && (
                          <Tooltip title="Delete user">
                            <span>
                              <AppButton
                                color="error"
                                size="small"
                                variant="text"
                                className="user-action-btn"
                                aria-label={`Delete ${user.name}`}
                                onClick={() => handleDeleteClick(user)}
                              >
                                <DeleteOutlineIcon className="user-action-icon" />
                              </AppButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}

                  {/* Column Settings Empty Cell */}
                  {showColumnSettings && (
                    <TableCell className="user-column-settings" />
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
        className="user-table-pagination"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(event.target.value)}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}
