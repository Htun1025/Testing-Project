"use client";

import { Box, Button, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "@/app/globals.css";
export default function AnnouncementBanner() {
  return (
    <Box className="announcement">
      <Box className="announcement-message">
        <StarIcon />

        <Typography>Star this project on GitHub</Typography>
      </Box>

      <Button
        endIcon={<ArrowForwardIcon />}
        className="announcement-button"
        onClick={() => {
          window.open("https://github.com", "_blank", "noopener,noreferrer");
        }}
      >
        View more
      </Button>
    </Box>
  );
}
