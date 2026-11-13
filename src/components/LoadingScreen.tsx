"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const t = useTranslations("Common");

  return (
    <Box className="fixed inset-0 z-[99999] flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
      {/* Logo Spinner */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Spinning Border */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[var(--primary)] border-r-[var(--primary)]" />

        {/* Logo Image */}
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[var(--surface)] shadow-lg">
          <Image
            src="/image.png"
            alt="App Logo"
            width={68}
            height={68}
            priority
            quality={75}
            sizes="64px"
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>

      {/* Loading Text */}
      <Typography className="!mt-6 !text-sm !font-semibold !text-[var(--foreground)]">
        {message || t("loading")}
      </Typography>

      {/* Loading Dots */}
      <div className="mt-3 flex gap-2">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            style={{ animationDelay: `${delay}ms` }}
            className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]"
          />
        ))}
      </div>
    </Box>
  );
}
