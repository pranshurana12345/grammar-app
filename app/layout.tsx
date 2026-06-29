import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import PWAInit from "@/components/PWAInit";

export const metadata: Metadata = {
  title: "Grammy",
  description: "100 grammar rules for AFCAT English. Study, test yourself, and track what you know.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Grammy",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Grammy",
    description: "100 grammar rules for AFCAT English. Study, test yourself, and track what you know.",
    siteName: "Grammy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Grammy" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grammy",
    description: "100 grammar rules for AFCAT English. Study, test yourself, and track what you know.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/icon.png" sizes="512x512" />
      </head>
      <body className="min-h-full" style={{ background: "#f0f4ff" }}>
        <PWAInit />
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
