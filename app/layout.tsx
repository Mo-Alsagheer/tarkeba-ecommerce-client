import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "تركيبة - متجر العطور",
  description: "منصة تركيبة لبيع العطور الفاخرة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <AuthInitializer>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
