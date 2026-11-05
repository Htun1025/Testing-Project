"use client";

import { useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import "./setting.css";

type Section =
  | "Account Info"
  | "About Me"
  | "Activity Log"
  | "Notifications"
  | "Security"
  | "Appearance"
  | "System";

const initialProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+95 987 654 321",
  status: "ACTIVE",
  about: "Administrator of the application.",
};

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("Account Info");
  const [profile, setProfile] = useState(initialProfile);
  const [photo, setPhoto] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const updateProfile = (field: keyof typeof initialProfile, value: string) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
  };

  const handlePhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    setPhoto(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setProfile(initialProfile);
    setPhoto("");
    setMessage("Form has been reset.");
  };

  const handleSave = () => {
    // Connect this handler to your update-profile API to save data permanently.
    setMessage("Changes are ready. Connect your API to save them permanently.");
  };

  const menuItems: Section[] = [
    "Account Info",
    "About Me",
    "Activity Log",
    "Notifications",
    "Security",
    "Appearance",
    "System",
  ];

  return (
    <Box className="settings-page">
      <Box className="settings-heading">
        <Box>
          <Typography className="settings-title">⚙ Settings</Typography>
          <Typography className="settings-subtitle">
            Customize your account and application preferences
          </Typography>
        </Box>
      </Box>

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

      <Paper className="settings-card" elevation={0}>
        <Box className="settings-profile-sidebar">
          <Box className="settings-avatar-wrap">
            <Avatar src={photo} className="settings-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Button
              className="settings-camera"
              onClick={() => fileRef.current?.click()}
            >
              📷
            </Button>
          </Box>

          <Typography className="settings-profile-name">
            {profile.name || "Your Name"}
          </Typography>
          <Typography className="settings-role">Administrator</Typography>
          <Typography className="settings-member">Account Settings</Typography>

          <Divider className="settings-divider" />
        </Box>

        <Box className="settings-content">
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
                  onChange={(e) => updateProfile("name", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) => updateProfile("phone", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile("email", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  select
                  label="Status"
                  value={profile.status}
                  onChange={(e) => updateProfile("status", e.target.value)}
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
                <Button
                  variant="outlined"
                  onClick={() => fileRef.current?.click()}
                >
                  Choose Photo
                </Button>
                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhoto(e.target.files?.[0])}
                />
              </Box>
            </>
          )}

          {section === "About Me" && (
            <>
              <Typography className="settings-section-title">
                About Me
              </Typography>
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
                onChange={(e) => updateProfile("about", e.target.value)}
              />
            </>
          )}

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
                  onChange={(e) => setNotifications(e.target.checked)}
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
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
              </Box>
            </>
          )}

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

          {section === "Appearance" && (
            <>
              <Typography className="settings-section-title">
                Appearance
              </Typography>
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
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              </Box>
            </>
          )}

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

          {message && (
            <Alert severity="info" className="settings-message">
              {message}
            </Alert>
          )}

          <Divider className="settings-divider" />

          <Box className="settings-actions">
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
