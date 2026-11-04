"use client";

import { Avatar, Box, Paper, Typography } from "@mui/material";
import type { SummaryItem } from "@/types";
import "@/app/globals.css";

type Props = {
  items: SummaryItem[];
};

export default function SummaryCards({ items }: Props) {
  return (
    <Box className="user-summary-grid">
      {items.map((item) => (
        <Paper key={item.label} className="user-summary-card" elevation={0}>
          <Avatar
            className="user-summary-icon"
            sx={{
              color: item.color,
              bgcolor: item.background,
            }}
          >
            {item.icon}
          </Avatar>

          <Box>
            <Typography className="user-summary-label">{item.label}</Typography>

            <Typography className="user-summary-value">{item.value}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
