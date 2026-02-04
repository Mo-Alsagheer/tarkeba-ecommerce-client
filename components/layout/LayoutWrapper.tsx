"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/reset-password") ||
    pathname?.startsWith("/verify-otp") ||
    pathname?.startsWith("/google");

  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}
