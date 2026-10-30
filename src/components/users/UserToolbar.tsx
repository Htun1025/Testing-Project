"use client";

import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  count: number;
};

export default function UserToolbar({
  search,
  onSearchChange,
  onCreate,
  count,
}: Props) {
  return (
    <Box className="user-table-toolbar">
      <Box>
        <Typography className="user-table-title">All Users</Typography>

        <Typography className="user-table-description">
          {count} users found
        </Typography>
      </Box>

      <Box className="user-toolbar-actions">
        <TextField
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="user-search-field"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          className="create-user-button"
        >
          Create User
        </Button>
      </Box>
    </Box>
  );
}
