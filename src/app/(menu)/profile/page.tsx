"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { Box, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { UserForm as UserFormData } from "@/types";
import useAuth from "@/hooks/useAuth";

import UserForm from "@/components/User_Add_Edit_Card";
import ProfileCard from "@/components/profile/ProfileCard";
import "@/app/globals.css";

export default function ProfilePage() {
  const t = useTranslations("Profile");

  // လက်ရှိ Login ဝင်ထားတဲ့ User ကိုယူခြင်း
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<UserFormData | null>(null);
  const [form, setForm] = useState<UserFormData | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Login User data ကို Profile Form အတွက် ပြောင်းလဲခြင်း
  useEffect(() => {
    if (!user) return;

    const userProfile: UserFormData = {
      name: user.name ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      password: "",
      phone: user.phone ?? "",
      nrc: user.nrc ?? "",
      address: user.address ?? "",
      status: user.status ?? "ACTIVE",
    };

    setProfile(userProfile);
    setForm(userProfile);
  }, [user]);

  // Edit Dialog ဖွင့်ခြင်း
  const handleOpenEdit = () => {
    if (!profile) return;

    setForm({
      ...profile,
      password: "",
    });

    setError("");
    setOpenEdit(true);
  };

  // Edit Dialog ပိတ်ခြင်း
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setError("");
  };

  // Form Input ပြောင်းလဲခြင်း
  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            [field]: value,
          }
        : previous,
    );
  };

  // Profile သိမ်းခြင်း
  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form) return;

    try {
      setSaving(true);
      setError("");

      setProfile({
        ...form,
        password: "",
      });

      setOpenEdit(false);
    } catch (err) {
      console.error("Save profile error:", err);
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  // Auth User Loading
  if (authLoading || !profile || !form) {
    return (
      <Box className="page-container">
        <Typography>{t("loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box className="page-container">
      {/* Page Heading */}
      <Box className="page-header">
        <Box className="page-header-content">
          <Typography component="h1" className="page-title">
            {t("myProfile")}
          </Typography>

          <Typography className="page-subtitle">
            {t("profileSubtitle")}
          </Typography>
        </Box>
      </Box>

      {/* Logged-in User Profile */}
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
        loading={saving}
        onFormChange={handleFormChange}
        onClose={handleCloseEdit}
        onSubmit={handleSave}
      />
    </Box>
  );
}
