"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import type { UserForm as UserFormData } from "@/types";
import UserForm from "@/components/User_Add_Edit_Card";

import "./profile.css";

const initialProfile: UserFormData = {
  name: "Admin User",
  username: "admin",
  email: "admin@gmail.com",
  password: "",
  phone: "09123456789",
  nrc: "12/TAMANA(N)123456",
  address: "Yangon, Myanmar",
  status: "Active",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserFormData>({
    ...initialProfile,
  });

  const [form, setForm] = useState<UserFormData>({
    ...initialProfile,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Open Edit Dialog
  const handleOpenEdit = () => {
    setForm({
      ...profile,
      password: "",
    });

    setError("");
    setOpenEdit(true);
  };

  // Close Edit Dialog
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setError("");
  };

  // Handle Form Changes
  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Save Profile
  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      setProfile({
        ...form,
        password: "",
      });

      setOpenEdit(false);
    } catch (err) {
      console.error("Save profile error:", err);
      setError("Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  // NRC Display
  const fullNrc = profile.nrc || "Not provided";

  return (
    <Box className="profile-page">
      {/* Page Heading */}
      <Box className="profile-heading">
        <Typography component="h1" className="profile-title">
          My Profile
        </Typography>

        <Typography className="profile-subtitle">
          Manage your personal information and account details.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper className="profile-card profile-user-card">
            {/* Card Header */}
            <Box className="profile-card-header">
              <Typography className="profile-section-title">
                User Profile
              </Typography>

              <Button
                variant="outlined"
                startIcon={<EditOutlinedIcon />}
                className="profile-edit-button"
                onClick={handleOpenEdit}
              >
                Edit
              </Button>
            </Box>

            <Divider className="profile-divider" />

            {/* Avatar */}
            <Avatar className="profile-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>

            <Typography className="profile-name">{profile.name}</Typography>

            <Typography className="profile-username">
              @{profile.username}
            </Typography>

            <Chip
              label={profile.status}
              color={profile.status === "Active" ? "success" : "default"}
              size="small"
              className="profile-status"
            />

            <Divider className="profile-divider" />

            {/* Profile Details */}
            <Stack className="profile-summary-details">
              {/* Email */}
              <Box className="profile-detail-item">
                <EmailOutlinedIcon className="profile-detail-icon" />

                <Box>
                  <Typography className="profile-detail-label">
                    Email Address
                  </Typography>

                  <Typography className="profile-detail-value">
                    {profile.email}
                  </Typography>
                </Box>
              </Box>

              {/* Phone */}
              <Box className="profile-detail-item">
                <PhoneOutlinedIcon className="profile-detail-icon" />

                <Box>
                  <Typography className="profile-detail-label">
                    Phone Number
                  </Typography>

                  <Typography className="profile-detail-value">
                    {profile.phone}
                  </Typography>
                </Box>
              </Box>

              {/* NRC */}
              <Box className="profile-detail-item">
                <BadgeOutlinedIcon className="profile-detail-icon" />

                <Box>
                  <Typography className="profile-detail-label">
                    NRC Number
                  </Typography>

                  <Typography className="profile-detail-value">
                    {fullNrc}
                  </Typography>
                </Box>
              </Box>

              {/* Address */}
              <Box className="profile-detail-item">
                <LocationOnOutlinedIcon className="profile-detail-icon" />

                <Box>
                  <Typography className="profile-detail-label">
                    Address
                  </Typography>

                  <Typography className="profile-detail-value">
                    {profile.address}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Reusable User Form */}
      <UserForm
        open={openEdit}
        editingUser={null}
        form={form}
        error={error}
        loading={loading}
        onFormChange={handleFormChange}
        onClose={handleCloseEdit}
        onSubmit={handleSave}
      />
    </Box>
  );
}
