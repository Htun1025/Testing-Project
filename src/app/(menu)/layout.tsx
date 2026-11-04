import type { ReactNode } from "react";
import MenuLayoutClient from "@/components/MenuLayoutClient";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MenuLayoutClient>{children}</MenuLayoutClient>
    </ThemeProvider>
  );
}
