"use client";

import { useRef, useState } from "react";

import { Box, Button, Paper, Typography } from "@mui/material";

import type { SettingsSection } from "@/components/setting/SettingsContent";
import type { SettingsProfile } from "@/types";

import SettingsProfileSidebar from "@/components/setting/SettingsProfileSidebar";
import SettingsContent from "@/components/setting/SettingsContent";
import { useTheme } from "@/components/ThemeProvider";

import "@/app/globals.css";

const initialProfile: SettingsProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+95 987 654 321",
  status: "ACTIVE",
  about: "Administrator of the application.",
};

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
  const [section, setSection] = useState<SettingsSection>("Account Info");

  const [profile, setProfile] = useState<SettingsProfile>({
    ...initialProfile,
  });

  const [photo, setPhoto] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [message, setMessage] = useState("");

  // Global Theme
  const { theme, toggleTheme } = useTheme();

  const darkMode = theme === "dark";

  const fileRef = useRef<HTMLInputElement>(null);

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
      setMessage("Please select an image file.");
      return;
    }

    setPhoto(URL.createObjectURL(file));
    setMessage("");
  };

  // Reset Settings
  const handleReset = () => {
    setProfile({ ...initialProfile });
    setPhoto("");
    setMessage("Form has been reset.");
  };

  // Save Settings
  const handleSave = () => {
    setMessage("Changes are ready. Connect your API to save them permanently.");
  };

  return (
    <Box className="settings-page">
      {/* PAGE HEADING */}
      <Box className="settings-heading">
        <Box>
          <Typography className="settings-title">⚙ Settings</Typography>

          <Typography className="settings-subtitle">
            Customize your account and application preferences
          </Typography>
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
            {item}
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
