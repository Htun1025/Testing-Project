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
  return (
    <Box className="settings-content">
      {/* ACCOUNT INFO */}
      {section === "Account Info" && (
        <>
          <Box className="settings-content-heading">
            <Box>
              <Typography className="settings-section-title">
                Account Information
              </Typography>

              <Typography className="settings-section-subtitle">
                Update your personal information
              </Typography>
            </Box>
          </Box>

          <Box className="settings-form-grid">
            <TextField
              label="Full Name"
              value={profile.name}
              onChange={(e) => onProfileChange("name", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => onProfileChange("phone", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => onProfileChange("email", e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              select
              label="Status"
              value={profile.status}
              onChange={(e) => onProfileChange("status", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>
          </Box>

          <Divider className="settings-divider" />

          <Typography className="settings-label">Profile Photo</Typography>

          <Typography className="settings-hint">
            Upload a new photo (JPG, PNG)
          </Typography>

          <Box className="settings-upload-row">
            <Avatar src={photo} className="settings-upload-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>

            <Button variant="outlined" onClick={onChoosePhoto}>
              Choose Photo
            </Button>
          </Box>
        </>
      )}

      {/* ABOUT ME */}
      {section === "About Me" && (
        <>
          <Typography className="settings-section-title">About Me</Typography>

          <Typography className="settings-section-subtitle">
            Add a short description about yourself
          </Typography>

          <TextField
            className="settings-about-field"
            label="About Me"
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
            Activity Log
          </Typography>

          <Typography className="settings-section-subtitle">
            Recent account activities
          </Typography>

          <Box className="settings-activity-list">
            <Box className="settings-activity-item">
              <Typography>Logged in to the system</Typography>

              <Typography>Today</Typography>
            </Box>

            <Box className="settings-activity-item">
              <Typography>Opened account settings</Typography>

              <Typography>Today</Typography>
            </Box>

            <Box className="settings-activity-item">
              <Typography>Profile information viewed</Typography>

              <Typography>Recently</Typography>
            </Box>
          </Box>
        </>
      )}

      {/* NOTIFICATIONS */}
      {section === "Notifications" && (
        <>
          <Typography className="settings-section-title">
            Notification Settings
          </Typography>

          <Typography className="settings-section-subtitle">
            Choose which notifications you want to receive
          </Typography>

          <Box className="settings-option-row">
            <Box>
              <Typography>Push Notifications</Typography>

              <Typography className="settings-hint">
                Receive notifications in the application
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
              <Typography>Email Notifications</Typography>

              <Typography className="settings-hint">
                Receive updates through email
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
            Security Settings
          </Typography>

          <Typography className="settings-section-subtitle">
            Manage your account security
          </Typography>

          <TextField
            label="Current Password"
            type="password"
            fullWidth
            size="small"
            className="settings-security-field"
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            size="small"
            className="settings-security-field"
          />

          <TextField
            label="Confirm New Password"
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
          <Typography className="settings-section-title">Appearance</Typography>

          <Typography className="settings-section-subtitle">
            Customize how your application looks
          </Typography>

          <Box className="settings-option-row">
            <Box>
              <Typography>Dark Mode</Typography>

              <Typography className="settings-hint">
                Switch between light and dark appearance
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
            System Settings
          </Typography>

          <Typography className="settings-section-subtitle">
            Application information
          </Typography>

          <Box className="settings-system-row">
            <Typography>Application</Typography>
            <Typography>User Management System</Typography>
          </Box>

          <Box className="settings-system-row">
            <Typography>Version</Typography>
            <Typography>1.0.0</Typography>
          </Box>

          <Box className="settings-system-row">
            <Typography>Framework</Typography>
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
          Reset
        </Button>

        <Button variant="contained" onClick={onSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
