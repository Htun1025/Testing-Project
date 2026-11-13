"use client";

import { useEffect, useRef, useState } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { SettingsSection } from "@/components/setting/SettingsContent";
import type { SettingsProfile } from "@/types";

import SettingsProfileSidebar from "@/components/setting/SettingsProfileSidebar";
import SettingsContent from "@/components/setting/SettingsContent";
import { useTheme } from "@/components/ThemeProvider";
import useAuth from "@/hooks/useAuth";

import "@/app/globals.css";

const menuItems: SettingsSection[] = [
  "Account Info",
  "About Me",
  "Activity Log",
  "Notifications",
  "Security",
  "Appearance",
  "System",
];

export default function SettingsPage() {
  const t = useTranslations("Settings");

  // လက်ရှိ Login ဝင်ထားတဲ့ User
  const { user, loading: authLoading } = useAuth();

  const [section, setSection] = useState<SettingsSection>("Account Info");

  const [profile, setProfile] = useState<SettingsProfile>({
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    about: "",
  });

  const [photo, setPhoto] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [message, setMessage] = useState("");

  // Global Theme
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const fileRef = useRef<HTMLInputElement>(null);

  // Login User Data ကို Settings ထဲသို့ ထည့်ခြင်း
  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      status: user.status ?? "ACTIVE",
      about: "",
    });
  }, [user]);

  // Update Profile
  const updateProfile = (field: keyof SettingsProfile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Change Global Theme
  const handleDarkModeChange = (value: boolean) => {
    if (value !== darkMode) {
      toggleTheme();
    }
  };

  // Choose Photo
  const handleChoosePhoto = () => {
    fileRef.current?.click();
  };

  // Handle Photo
  const handlePhoto = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(t("invalidImage"));
      return;
    }

    setPhoto(URL.createObjectURL(file));
    setMessage("");
  };

  // Reset Settings ကို Login User Data ဖြင့် ပြန်ထားခြင်း
  const handleReset = () => {
    if (!user) return;

    setProfile({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      status: user.status ?? "ACTIVE",
      about: "",
    });

    setPhoto("");
    setMessage(t("resetSuccess"));
  };

  // Save Settings
  const handleSave = () => {
    // လက်ရှိအချိန်တွင် React state ထဲ၌သာ သိမ်းထားပါသည်။
    setMessage(t("saveInfo"));
  };

  // Login User Loading
  if (authLoading || !user) {
    return (
      <Box className="settings-page">
        <Typography>{t("loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box className="settings-page">
      {/* PAGE HEADING */}
      <Box className="settings-heading">
        <Box>
          <Typography className="settings-title">⚙ {t("title")}</Typography>

          <Typography className="settings-subtitle">{t("subtitle")}</Typography>
        </Box>
      </Box>

      {/* SETTINGS TABS */}
      <Box className="settings-tabs">
        {menuItems.map((item) => (
          <Button
            key={item}
            className={`settings-tab ${section === item ? "active" : ""}`}
            onClick={() => {
              setSection(item);
              setMessage("");
            }}
          >
            {t(`tabs.${item}`)}
          </Button>
        ))}
      </Box>

      {/* SETTINGS CARD */}
      <Paper className="settings-card" elevation={0}>
        <SettingsProfileSidebar
          name={profile.name}
          photo={photo}
          onChoosePhoto={handleChoosePhoto}
        />

        <SettingsContent
          section={section}
          profile={profile}
          photo={photo}
          notifications={notifications}
          emailNotifications={emailNotifications}
          darkMode={darkMode}
          message={message}
          onProfileChange={updateProfile}
          onChoosePhoto={handleChoosePhoto}
          onNotificationsChange={setNotifications}
          onEmailNotificationsChange={setEmailNotifications}
          onDarkModeChange={handleDarkModeChange}
          onReset={handleReset}
          onSave={handleSave}
        />
      </Paper>

      {/* HIDDEN PHOTO INPUT */}
      <input
        ref={fileRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => handlePhoto(e.target.files?.[0])}
      />
    </Box>
  );
}
