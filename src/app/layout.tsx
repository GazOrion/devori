import type { Metadata } from "next";
import localFont from "next/font/local";
import { CookieConsentBanner } from "@/components/ui/cookie-consent";
import { DesktopZoomLock } from "@/components/ui/desktop-zoom-lock";
import "./globals.css";

const coolvetica = localFont({
  src: "../fonts/CoolveticaRg.woff2",
  variable: "--font-coolvetica",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "devori",
  description: "Landing page hero for the devori IT company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${coolvetica.variable} h-full antialiased`}>
      <body className={`${coolvetica.className} min-h-full flex flex-col font-sans`}>
        <DesktopZoomLock />
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
