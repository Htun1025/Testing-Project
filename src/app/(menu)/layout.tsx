import type { ReactNode } from "react";
import MenuLayoutClient from "@/components/MenuLayoutClient";

export default function MenuLayout({ children }: { children: ReactNode }) {
  return <MenuLayoutClient>{children}</MenuLayoutClient>;
}
