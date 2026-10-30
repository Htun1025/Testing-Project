"use client";

import {
  Avatar,
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "@/app/globals.css";
export type UserRow = {
  id: number;
  name: string;
  job: string;
  amount: string;
  status: "Approved" | "Pending" | "Denied" | "Expired";
  date: string;
};

type UsersTableProps = {
  users: UserRow[];
};

export default function UserTable({ users }: UsersTableProps) {
  return (
    <Card className="table-card" elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CLIENT</TableCell>
              <TableCell>AMOUNT</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>DATE</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>
                  <Box className="client-cell">
                    <Avatar className="client-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography className="client-name">
                        {user.name}
                      </Typography>

                      <Typography className="client-job">{user.job}</Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>{user.amount}</TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={user.status}
                    className={`status-chip status-${user.status.toLowerCase()}`}
                  />
                </TableCell>

                <TableCell>{user.date}</TableCell>
              </TableRow>
            ))}

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
