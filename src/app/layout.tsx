import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import { CallbackWidget } from "@/components/ui/callback-widget";
import { ContactModalProvider } from "@/components/ui/contact-modal-context";
import { CookieConsentBanner } from "@/components/ui/cookie-consent";
import { DesktopZoomLock } from "@/components/ui/desktop-zoom-lock";
import "./globals.css";

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "devori",
  description: "Landing page hero for the devori IT company.",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geologica.variable} h-full antialiased`}>
      <body className={`${geologica.className} min-h-full flex flex-col font-sans`}>
        <ContactModalProvider>
          <DesktopZoomLock />
          {children}
          <CallbackWidget />
          <CookieConsentBanner />
        </ContactModalProvider>
      </body>
    </html>
  );
}
