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

import { useTranslations } from "next-intl";

import type { UserForm as UserFormData } from "@/types";

import ProfileDetails from "@/components/profile/ProfileDetails";
import "@/app/globals.css";

type ProfileCardProps = {
  profile: UserFormData;
  onEdit: () => void;
};

export default function ProfileCard({ profile, onEdit }: ProfileCardProps) {
  const t = useTranslations("Profile");

  return (
    <Paper className="profile-card profile-user-card">
      {/* Card Header */}
      <Box className="profile-card-header">
        <Typography className="profile-section-title">
          {t("userProfile")}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          className="profile-edit-button"
          onClick={onEdit}
        >
          {t("edit")}
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
        label={profile.status === "ACTIVE" ? t("active") : t("inactive")}
        color={profile.status === "ACTIVE" ? "success" : "default"}
        size="small"
        className="profile-status"
      />

      <Divider className="profile-divider" />

      {/* Profile Details */}
      <ProfileDetails profile={profile} />
    </Paper>
  );
}
