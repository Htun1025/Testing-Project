"use client";

import { createContext, useContext, type ReactNode } from "react";

import { useLocale } from "next-intl";

import { useRouter } from "next/navigation";

export type Locale = "eng" | "mm" | "jap" | "china";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as Locale;

  const router = useRouter();

  const setLocale = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; samesite=lax`;

    router.refresh();
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
