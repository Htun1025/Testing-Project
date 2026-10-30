"use client";

import {
  Avatar,
  Box,
  Chip,
  IconButton,
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

import type { User } from "@/types";
import "@/app/(menu)/user/user.css";
type UserTableProps = {
  users: User[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (value: string) => void;
};

export default function UserTable({
  users,
  totalCount,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
  onPageChange,
  onRowsPerPageChange,
}: UserTableProps) {
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Box sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No users found.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow hover key={user.id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar>{user.name.charAt(0).toUpperCase()}</Avatar>

                      <Typography sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === "Active" ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit user">
                      <IconButton
                        color="primary"
                        aria-label={`Edit ${user.name}`}
                        onClick={() => onEdit(user)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete user">
                      <IconButton
                        color="error"
                        aria-label={`Delete ${user.name}`}
                        onClick={() => onDelete(user)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
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
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(event.target.value)}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
}
