import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";
import "@/app/globals.css";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  background: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  background,
}: StatCardProps) {
  return (
    <Card className="statistics-card" elevation={0}>
      <CardContent className="statistics-card-content">
        <Box
          className="statistics-icon"
          sx={{
            color: color,
            backgroundColor: background,
          }}
        >
          {icon}
        </Box>

        <Box className="statistics-text">
          <Typography className="statistics-label">{title}</Typography>

          <Typography className="statistics-value">{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
