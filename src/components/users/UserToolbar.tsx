"use client";

import { Box, InputAdornment, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import AppButton from "@/components/AppButton";
import "@/app/(menu)/user/user.css";

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

        <AppButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          className="create-user-button"
        >
          Create User
        </AppButton>
      </Box>
    </Box>
  );
}
