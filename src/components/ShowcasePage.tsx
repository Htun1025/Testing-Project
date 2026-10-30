"use client";

import {
  Box,
  Paper,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import type { ReactNode } from "react";

type ShowcasePageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function ShowcasePage({
  title,
  description,
  children,
}: ShowcasePageProps) {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <MuiLink underline="hover" color="inherit" href="/dashboard">
          Dashboard
        </MuiLink>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 3 }}>
        <Typography
          component="h1"
          sx={{ fontSize: 28, fontWeight: 800, color: "#1f1635" }}
        >
          {title}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}

export function ShowcaseCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #eeeaf5",
        borderRadius: 3,
        minWidth: 0,
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
      {children}
    </Paper>
  );
}
