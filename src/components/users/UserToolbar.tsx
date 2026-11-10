"use client";

import { Stack, InputAdornment, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import AppButton from "@/components/AppButton";

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
}: Props) {
  return (
    <Stack direction="row" spacing={1} className="page-actions">
      <TextField
        size="small"
        placeholder="Search users..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="search-field"
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
        className="add-button"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreate}
      >
        Create User
      </AppButton>
    </Stack>
  );
}
