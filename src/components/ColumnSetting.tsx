"use client";

import { useState } from "react";

import {
  Box,
  Checkbox,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";

import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import type { TableColumn } from "@/types";
import "@/app/(menu)/user/user.css";

type ColumnSettingsProps = {
  columns: TableColumn[];
  visibleColumns: string[];
  onToggle: (columnId: string) => void;
};

export default function ColumnSettings({
  columns,
  visibleColumns,
  onToggle,
}: ColumnSettingsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Show / Hide Columns">
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          size="small"
          className="column-settings-btn"
        >
          <ViewColumnIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            className: "column-settings-menu",
          },
        }}
      >
        <Box className="column-menu-title">Show / Hide Columns</Box>

        {columns.map((column) => (
          <MenuItem
            key={column.id}
            onClick={() => onToggle(column.id)}
            dense
            className="column-menu-item"
          >
            <Checkbox
              checked={visibleColumns.includes(column.id)}
              size="small"
            />

            <ListItemText primary={column.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
