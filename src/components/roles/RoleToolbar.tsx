"use client";

import { Button, InputAdornment, Stack, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslations } from "next-intl";

import AppButton from "../AppButton";
import "@/app/globals.css";

interface RoleToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

export default function RoleToolbar({
  search,
  onSearchChange,
  onAdd,
}: RoleToolbarProps) {
  const t = useTranslations("Roles");

  return (
    <Stack direction="row" spacing={1} className="page-actions">
      <TextField
        className="page-search"
        size="small"
        placeholder={t("searchRoles")}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
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
        onClick={onAdd}
      >
        {t("addRole")}
      </AppButton>
    </Stack>
  );
}
