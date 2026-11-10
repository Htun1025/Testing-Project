"use client";

import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import "@/app/globals.css";

type SettingsProfileSidebarProps = {
  name: string;
  photo: string;
  onChoosePhoto: () => void;
};

export default function SettingsProfileSidebar({
  name,
  photo,
  onChoosePhoto,
}: SettingsProfileSidebarProps) {
  return (
    <Box className="settings-profile-sidebar">
      <Box className="settings-avatar-wrap">
        <Avatar src={photo} className="settings-avatar">
          {name.charAt(0).toUpperCase()}
        </Avatar>

        <Button className="settings-camera" onClick={onChoosePhoto}>
          📷
        </Button>
      </Box>

      <Typography className="settings-profile-name">
        {name || "Your Name"}
      </Typography>

      <Typography className="settings-role">Administrator</Typography>

      <Typography className="settings-member">Account Settings</Typography>

      <Divider className="settings-divider" />
    </Box>
  );
}
