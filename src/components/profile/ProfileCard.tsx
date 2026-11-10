"use client";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import type { UserForm as UserFormData } from "@/types";

import ProfileDetails from "@/components/profile/ProfileDetails";
import "@/app/globals.css";

type ProfileCardProps = {
  profile: UserFormData;
  onEdit: () => void;
};

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  return (
    <Paper className="profile-card profile-user-card">
      {/* Card Header */}
      <Box className="profile-card-header">
        <Typography className="profile-section-title">User Profile</Typography>

        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          className="profile-edit-button"
          onClick={onEdit}
        >
          Edit
        </Button>
      </Box>

      <Divider className="profile-divider" />

      {/* Avatar */}
      <Avatar className="profile-avatar">
        {profile.name?.charAt(0).toUpperCase() || "U"}
      </Avatar>

      <Typography className="profile-name">{profile.name}</Typography>

      <Typography className="profile-username">@{profile.username}</Typography>

      <Chip
        label={profile.status}
        color={profile.status === "Active" ? "success" : "default"}
        size="small"
        className="profile-status"
      />

      <Divider className="profile-divider" />

      {/* Profile Details */}
      <ProfileDetails profile={profile} />
    </Paper>
  );
}
