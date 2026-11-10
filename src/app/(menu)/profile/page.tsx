"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Box, Grid, Typography } from "@mui/material";

import type { UserForm as UserFormData } from "@/types";

import UserForm from "@/components/User_Add_Edit_Card";
import ProfileCard from "@/components/profile/ProfileCard";
import "@/app/globals.css";

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

  return (
    <Box className="page-container">
      {/* Page Heading */}
      <Box className="page-header">
        <Box className="page-header-content">
          <Typography component="h1" className="page-title">
            My Profile
          </Typography>

          <Typography className="page-subtitle">
            Manage your personal information and account details.
          </Typography>
        </Box>
      </Box>

      {/* Profile Card */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <ProfileCard profile={profile} onEdit={handleOpenEdit} />
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
