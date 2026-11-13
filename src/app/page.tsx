"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import "./globals.css";
import DashboardHeader from "@/components/DashboardHeader";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="home-page min-h-screen flex flex-col">
      <DashboardHeader showLanguageOnly />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-11 py-5">
        <h1 className="text-xl font-bold home-title">{t("appName")}</h1>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-3xl text-center">
          <div className="home-badge inline-flex px-4 py-2 rounded-full text-sm mb-6">
            {t("badge")}
          </div>

          <h2 className="home-title text-2xl md:text-xl font-bold leading-tight mb-3">
            {t("heading")}
            <span className="home-highlight block mt-2">{t("highlight")}</span>
          </h2>

          <p className="home-description text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="home-primary-btn px-8 py-3 rounded-lg font-semibold"
            >
              {t("getStarted")} →
            </Link>

            <Link
              href="/login"
              className="home-secondary-btn px-8 py-3 rounded-lg font-semibold"
            >
              {t("signIn")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer text-center py-5 px-4 text-sm">
        {t("footer", { year: new Date().getFullYear() })}
      </footer>
    </main>
  );
}
