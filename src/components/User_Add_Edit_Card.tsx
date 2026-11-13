"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Alert,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import type { User, UserForm } from "@/types";
import AppButton from "@/components/AppButton";
import nrcData from "@/data/nrc.json";
import "@/app/globals.css";
import { useLocale, useTranslations } from "next-intl";

type UserDialogProps = {
  open: boolean;
  editingUser: User | null;
  form: UserForm;
  error: string;
  loading: boolean;
  onFormChange: (field: keyof UserForm, value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type FormErrors = {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  nrc?: string;
  address?: string;
  status?: string;
};

type NrcParts = {
  region: string;
  township: string;
  type: string;
  number: string;
};

type NrcDataItem = {
  state_code: string;
  state_en: string;
  state_mm: string;
  township_code_en: string;
  township_code_mm: string;
  township_en: string[];
  township_mm: string[];
};

const townshipData = nrcData as NrcDataItem[];

const emptyNrc: NrcParts = {
  region: "",
  township: "",
  type: "N",
  number: "",
};

const regions = Array.from(
  new Map(
    townshipData.map((item) => [
      item.state_code,
      {
        code: item.state_code,
        nameEn: item.state_en,
        nameMm: item.state_mm,
      },
    ]),
  ).values(),
);

const parseNrc = (nrc: string): NrcParts => {
  const match = nrc.match(/^(\d{1,2})\/([A-Z]+)\(([NEP])\)(\d{6})$/i);

  if (!match) return { ...emptyNrc };

  return {
    region: String(Number(match[1])),
    township: match[2].toUpperCase(),
    type: match[3].toUpperCase(),
    number: match[4],
  };
};

export default function UserForm({
  open,
  editingUser,
  form,
  error,
  loading,
  onFormChange,
  onClose,
  onSubmit,
}: UserDialogProps) {
  const t = useTranslations("Users");
  const locale = useLocale();

  const isMyanmar = locale === "mm";
  const isEditing = editingUser !== null;

  const [errors, setErrors] = useState<FormErrors>({});
  const [nrcParts, setNrcParts] = useState<NrcParts>({ ...emptyNrc });

  useEffect(() => {
    if (open) {
      setNrcParts(parseNrc(form.nrc || ""));
      setErrors({});
    }
  }, [open, editingUser?.id]);

  if (!open) return null;

  const fullNrc =
    nrcParts.region && nrcParts.township && nrcParts.number.length === 6
      ? `${nrcParts.region}/${nrcParts.township}(${nrcParts.type})${nrcParts.number}`
      : "";

  const updateNrc = (updated: NrcParts) => {
    setNrcParts(updated);

    const nrc =
      updated.region && updated.township && updated.number.length === 6
        ? `${updated.region}/${updated.township}(${updated.type})${updated.number}`
        : "";

    onFormChange("nrc", nrc);

    setErrors((previous) => ({
      ...previous,
      nrc: undefined,
    }));
  };

  const handleChange = (field: keyof UserForm, value: string) => {
    onFormChange(field, value);

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!form.username.trim()) {
      newErrors.username = t("validation.usernameRequired");
    } else if (form.username.trim().length < 3) {
      newErrors.username = t("validation.usernameMin");
    }

    if (!form.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!isEditing) {
      if (!form.password) {
        newErrors.password = t("validation.passwordRequired");
      } else if (form.password.length < 6) {
        newErrors.password = t("validation.passwordMin");
      }
    }

    if (!form.phone.trim()) {
      newErrors.phone = t("validation.phoneRequired");
    }

    const selectedTownship = townshipData.some(
      (item) =>
        item.state_code === nrcParts.region &&
        item.township_code_en === nrcParts.township,
    );

    if (!form.nrc.trim()) {
      newErrors.nrc = t("validation.nrcRequired");
    } else if (
      !selectedTownship ||
      !/^\d{1,2}\/[A-Z]+\([NEP]\)\d{6}$/.test(form.nrc)
    ) {
      newErrors.nrc = t("validation.nrcInvalid");
    }

    if (!form.address.trim()) {
      newErrors.address = t("validation.addressRequired");
    }

    if (!form.status) {
      newErrors.status = t("validation.statusRequired");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    onSubmit(event);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const filteredTownships = townshipData.filter(
    (item) => item.state_code === nrcParts.region,
  );

  return (
    <Box className="form-overlay">
      <Card className="form-card">
        <CardContent className="form-card">
          <Box className="form-header">
            <Box>
              <Typography className="form-title">
                {isEditing ? t("editUser") : t("createUser")}
              </Typography>

              <Typography className="form-subtitle">
                {isEditing ? t("updateUserInfo") : t("createUserInfo")}
              </Typography>
            </Box>

            <IconButton
              onClick={handleClose}
              aria-label={t("closeForm")}
              className="form-close"
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={handleSubmit} noValidate>
            <Box className="form-grid">
              <TextField
                label={t("name")}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
              />

              <TextField
                label={t("username")}
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
              />

              <TextField
                label={t("email")}
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
              />

              {!isEditing && (
                <TextField
                  label={t("password")}
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                />
              )}

              <TextField
                label={t("phone")}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
              />

              <Box className="nrc-grid">
                <TextField
                  label={t("region")}
                  select
                  value={nrcParts.region}
                  onChange={(e) =>
                    updateNrc({
                      ...nrcParts,
                      region: e.target.value,
                      township: "",
                    })
                  }
                  fullWidth
                >
                  {regions.map((region) => (
                    <MenuItem key={region.code} value={region.code}>
                      {region.code} -{" "}
                      {isMyanmar ? region.nameMm : region.nameEn}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label={t("townshipCode")}
                  select
                  value={nrcParts.township}
                  onChange={(e) =>
                    updateNrc({
                      ...nrcParts,
                      township: e.target.value,
                    })
                  }
                  disabled={!nrcParts.region}
                  fullWidth
                >
                  {filteredTownships.map((item, index) => (
                    <MenuItem
                      key={`${item.state_code}-${item.township_code_en}-${index}`}
                      value={item.township_code_en}
                    >
                      {item.township_code_en} -{" "}
                      {isMyanmar ? item.township_mm[0] : item.township_en[0]}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label={t("type")}
                  select
                  value={nrcParts.type}
                  onChange={(e) =>
                    updateNrc({
                      ...nrcParts,
                      type: e.target.value,
                    })
                  }
                  fullWidth
                >
                  <MenuItem value="N">N</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="P">P</MenuItem>
                </TextField>

                <TextField
                  label={t("number")}
                  placeholder="123456"
                  value={nrcParts.number}
                  onChange={(e) =>
                    updateNrc({
                      ...nrcParts,
                      number: e.target.value.replace(/\D/g, "").slice(0, 6),
                    })
                  }
                  fullWidth
                  slotProps={{
                    htmlInput: {
                      maxLength: 6,
                      inputMode: "numeric",
                    },
                  }}
                />
              </Box>

              <Box className="nrc-preview">
                <Typography className="user-nrc-label" variant="caption">
                  {t("nrcPreview")}
                </Typography>

                <Typography className="nrc-value">
                  {fullNrc || t("nrcPlaceholder")}
                </Typography>

                {errors.nrc && (
                  <Typography className="nrc-error">{errors.nrc}</Typography>
                )}
              </Box>

              <TextField
                className="user-address"
                label={t("address")}
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                fullWidth
                multiline
                rows={1}
                error={!!errors.address}
                helperText={errors.address}
              />

              <TextField
                className="user-status-field"
                select
                value={form.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
                fullWidth
                error={!!errors.status}
                helperText={errors.status}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (selected) => {
                      if (!selected) {
                        return (
                          <span className="status-placeholder">
                            {t("status")}
                          </span>
                        );
                      }

                      return selected === "ACTIVE"
                        ? t("active")
                        : t("inactive");
                    },
                  },
                }}
              >
                <MenuItem value="ACTIVE">{t("active")}</MenuItem>
                <MenuItem value="INACTIVE">{t("inactive")}</MenuItem>
              </TextField>

              {error && (
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}

              <Box className="form-actions">
                <AppButton
                  onClick={handleClose}
                  color="inherit"
                  variant="outlined"
                  disabled={loading}
                >
                  {t("cancel")}
                </AppButton>

                <AppButton type="submit" variant="contained" disabled={loading}>
                  {loading
                    ? t("saving")
                    : isEditing
                      ? t("saveChanges")
                      : t("createUser")}
                </AppButton>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
