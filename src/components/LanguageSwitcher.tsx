"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "eng", label: "🇬🇧 English" },
  { code: "mm", label: "🇲🇲 မြန်မာ" },
  { code: "jap", label: "🇯🇵 日本語" },
  { code: "china", label: "🇨🇳 中文" },
] as const;

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <FormControl size="small" className="language-switcher">
      <Select
        size="small"
        value={locale}
        onChange={(event) => setLocale(event.target.value as typeof locale)}
        className="language-select"
        MenuProps={{
          slotProps: {
            paper: {
              className: "language-menu",
            },
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            value={language.code}
            className="language-menu-item"
          >
            {language.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
