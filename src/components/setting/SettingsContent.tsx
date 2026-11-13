"use client";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import type { SettingsProfile } from "@/types";
import "@/app/globals.css";

export type SettingsSection =
  | "Account Info"
  | "About Me"
  | "Activity Log"
  | "Notifications"
  | "Security"
  | "Appearance"
  | "System";

export type SettingsContentProps = {
  section: SettingsSection;
  profile: SettingsProfile;
  photo: string;
  notifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  message: string;

  onProfileChange: (field: keyof SettingsProfile, value: string) => void;
  onChoosePhoto: () => void;
  onNotificationsChange: (value: boolean) => void;
  onEmailNotificationsChange: (value: boolean) => void;
  onDarkModeChange: (value: boolean) => void;
  onReset: () => void;
  onSave: () => void;
};

export default function SettingsContent({
  section,
  profile,
  photo,
  notifications,
  emailNotifications,
  darkMode,
  message,
  onProfileChange,
  onChoosePhoto,
  onNotificationsChange,
  onEmailNotificationsChange,
  onDarkModeChange,
  onReset,
  onSave,
}: SettingsContentProps) {
  const t = useTranslations("Settings");

  return (
    <Box className="settings-content">
      {/* ACCOUNT INFO */}
      {section === "Account Info" && (
        <>
          <Box className="settings-content-heading">
            <Box>
              <Typography className="settings-section-title">
                {t("accountInformation")}
              </Typography>

              <Typography className="settings-section-subtitle">
                {t("updatePersonalInfo")}
              </Typography>
            </Box>
          </Box>

          <Box className="settings-form-grid">
            <TextField
              label={t("fullName")}
              value={profile.name}
              onChange={(e) => onProfileChange("name", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label={t("phoneNumber")}
              value={profile.phone}
              onChange={(e) => onProfileChange("phone", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label={t("emailAddress")}
              type="email"
              value={profile.email}
              onChange={(e) => onProfileChange("email", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              select
              label={t("status")}
              value={profile.status}
              onChange={(e) => onProfileChange("status", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="ACTIVE">{t("active")}</MenuItem>
              <MenuItem value="INACTIVE">{t("inactive")}</MenuItem>
            </TextField>
          </Box>

          <Divider className="settings-divider" />

          <Typography className="settings-label">
            {t("profilePhoto")}
          </Typography>

          <Typography className="settings-hint">
            {t("uploadPhotoHint")}
          </Typography>

          <Box className="settings-upload-row">
            <Avatar src={photo} className="settings-upload-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>

            <Button variant="outlined" onClick={onChoosePhoto}>
              {t("choosePhoto")}
            </Button>
          </Box>
        </>
      )}

      {/* ABOUT ME */}
      {section === "About Me" && (
        <>
          <Typography className="settings-section-title">
            {t("aboutMe")}
          </Typography>

          <Typography className="settings-section-subtitle">
            {t("aboutMeSubtitle")}
          </Typography>

          <TextField
            className="settings-about-field"
            label={t("aboutMe")}
            multiline
            minRows={5}
            fullWidth
            value={profile.about}
            onChange={(e) => onProfileChange("about", e.target.value)}
          />
        </>
      )}

      {/* ACTIVITY LOG */}
      {section === "Activity Log" && (
        <>
          <Typography className="settings-section-title">
            {t("activityLog")}
          </Typography>

          <Typography className="settings-section-subtitle">
            {t("recentActivities")}
          </Typography>

          <Box className="settings-activity-list">
            <Box className="settings-activity-item">
              <Typography>{t("loggedIn")}</Typography>
              <Typography>{t("today")}</Typography>
            </Box>

            <Box className="settings-activity-item">
              <Typography>{t("openedSettings")}</Typography>
              <Typography>{t("today")}</Typography>
            </Box>

            <Box className="settings-activity-item">
              <Typography>{t("profileViewed")}</Typography>
              <Typography>{t("recently")}</Typography>
            </Box>
          </Box>
        </>
      )}

      {/* NOTIFICATIONS */}
      {section === "Notifications" && (
        <>
          <Typography className="settings-section-title">
            {t("notificationSettings")}
          </Typography>

          <Typography className="settings-section-subtitle">
            {t("notificationSubtitle")}
          </Typography>

          <Box className="settings-option-row">
            <Box>
              <Typography>{t("pushNotifications")}</Typography>

              <Typography className="settings-hint">
                {t("pushNotificationsHint")}
              </Typography>
            </Box>

            <Switch
              checked={notifications}
              onChange={(e) => onNotificationsChange(e.target.checked)}
            />
          </Box>

          <Divider />

          <Box className="settings-option-row">
            <Box>
              <Typography>{t("emailNotifications")}</Typography>

              <Typography className="settings-hint">
                {t("emailNotificationsHint")}
              </Typography>
            </Box>

            <Switch
              checked={emailNotifications}
              onChange={(e) => onEmailNotificationsChange(e.target.checked)}
            />
          </Box>
        </>
      )}

      {/* SECURITY */}
      {section === "Security" && (
        <>
          <Typography className="settings-section-title">
            {t("securitySettings")}
          </Typography>

          <Typography className="settings-section-subtitle">
            {t("securitySubtitle")}
          </Typography>

          <TextField
            label={t("currentPassword")}
            type="password"
            fullWidth
            size="small"
            className="settings-security-field"
          />

          <TextField
            label={t("newPassword")}
            type="password"
            fullWidth
            size="small"
            className="settings-security-field"
          />

          <TextField
            label={t("confirmNewPassword")}
            type="password"
            fullWidth
            size="small"
            className="settings-security-field"
          />
        </>
      )}

      {/* APPEARANCE */}
      {section === "Appearance" && (
        <>
          <Typography className="settings-section-title">
            {t("appearance")}
          </Typography>

          <Typography className="settings-section-subtitle">
            {t("appearanceSubtitle")}
          </Typography>

          <Box className="settings-option-row">
            <Box>
              <Typography>{t("darkMode")}</Typography>

              <Typography className="settings-hint">
                {t("darkModeHint")}
              </Typography>
            </Box>

            <Switch
              checked={darkMode}
              onChange={(e) => onDarkModeChange(e.target.checked)}
            />
          </Box>
        </>
      )}

      {/* SYSTEM */}
      {section === "System" && (
        <>
          <Typography className="settings-section-title">
            {t("systemSettings")}
          </Typography>

          <Typography className="settings-section-subtitle">
            {t("systemSubtitle")}
          </Typography>

          <Box className="settings-system-row">
            <Typography>{t("application")}</Typography>
            <Typography>User Management System</Typography>
          </Box>

          <Box className="settings-system-row">
            <Typography>{t("version")}</Typography>
            <Typography>1.0.0</Typography>
          </Box>

          <Box className="settings-system-row">
            <Typography>{t("framework")}</Typography>
            <Typography>Next.js + MUI</Typography>
          </Box>
        </>
      )}

      {/* MESSAGE */}
      {message && (
        <Alert severity="info" className="settings-message">
          {message}
        </Alert>
      )}

      <Divider className="settings-divider" />

      {/* ACTIONS */}
      <Box className="settings-actions">
        <Button variant="outlined" onClick={onReset}>
          {t("reset")}
        </Button>

        <Button variant="contained" onClick={onSave}>
          {t("saveChanges")}
        </Button>
      </Box>
    </Box>
  );
}
