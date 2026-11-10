"use client";

import { Box, Typography } from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import type { UserForm as UserFormData } from "@/types";
import "@/app/globals.css";

type ProfileDetailsProps = {
  profile: UserFormData;
};

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  const fullNrc = profile.nrc || "Not provided";

  return (
    <Box className="profile-summary-details">
      <Box className="profile-details-grid">
        {/* Email */}
        <Box className="profile-detail-item">
          <EmailOutlinedIcon className="profile-detail-icon" />

          <Box>
            <Typography className="profile-detail-label">
              Email Address
            </Typography>

            <Typography className="profile-detail-value">
              {profile.email || "Not provided"}
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
              {profile.phone || "Not provided"}
            </Typography>
          </Box>
        </Box>

        {/* NRC */}
        <Box className="profile-detail-item">
          <BadgeOutlinedIcon className="profile-detail-icon" />

          <Box>
            <Typography className="profile-detail-label">NRC Number</Typography>

            <Typography className="profile-detail-value">{fullNrc}</Typography>
          </Box>
        </Box>

        {/* Address */}
        <Box className="profile-detail-item">
          <LocationOnOutlinedIcon className="profile-detail-icon" />

          <Box>
            <Typography className="profile-detail-label">Address</Typography>

            <Typography className="profile-detail-value">
              {profile.address || "Not provided"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
