"use client";

import { Button, InputAdornment, Stack, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import "@/app/globals.css";

interface PermissionToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

export default function PermissionToolbar({
  search,
  onSearchChange,
  onAdd,
}: PermissionToolbarProps) {
  return (
    <Stack direction="row" spacing={1} className="page-actions">
      <TextField
        className="page-search"
        size="small"
        placeholder="Search permissions..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        className="add-button"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
      >
        Add Permission
      </Button>
    </Stack>
  );
}
