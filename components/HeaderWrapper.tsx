"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Render header on "/", "/about", and "/mandate"
  if (pathname !== "/" && pathname !== "/about" && pathname !== "/mandate") return null;

  return <Header />;
}