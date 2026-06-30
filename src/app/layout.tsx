import type { Metadata, Viewport } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://mplh-dlhtts.vercel.app"),

  title: {
    default: "Monitor Patuh-LH | DLH TTS",
    template: "%s | Monitor Patuh-LH",
  },

  description:
    "Sistem resmi Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan untuk monitoring, pelaporan, dan evaluasi kepatuhan lingkungan hidup berbasis digital.",

  keywords: [
    "DLH TTS",
    "Dinas Lingkungan Hidup Timor Tengah Selatan",
    "monitoring lingkungan hidup",
    "SPPL",
    "UKL-UPL",
    "laporan lingkungan",
    "kepatuhan lingkungan hidup",
    "sistem pelaporan lingkungan",
    "sampah",
    "limbah",
    "soe",
    "tts",
  ],

  applicationName: "Monitor Patuh-LH",

  authors: [
    {
      name: "Dinas Lingkungan Hidup Kabupaten Timor Tengah Selatan",
    },
  ],

  creator: "DLH TTS",
  publisher: "DLH TTS",

  alternates: {
    canonical: "https://mplh-dlhtts.vercel.app",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": 160,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://mplh-dlhtts.vercel.app",
    title: "Monitor Patuh-LH | DLH TTS",
    description:
      "Sistem monitoring kepatuhan pelaporan lingkungan hidup Kabupaten Timor Tengah Selatan.",
    siteName: "Monitor Patuh-LH",
    locale: "id_ID",
  },

  twitter: {
    card: "summary_large_image",
    title: "Monitor Patuh-LH | DLH TTS",
    description:
      "Sistem monitoring kepatuhan pelaporan lingkungan hidup Kabupaten Timor Tengah Selatan.",
  },

  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="nextjs-ui-theme">
          <SidebarConfigProvider>
            {children}
          </SidebarConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
