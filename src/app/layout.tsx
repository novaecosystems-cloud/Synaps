import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Synaps AI — 3D Corporate Memory & 10-Agent AI Boardroom",
  description: "Synaps AI transforms complex document libraries into an interactive 3D Knowledge Graph and a 10-Agent AI C-Suite Boardroom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load Inter & IBM Plex Mono via direct Google Fonts link */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Caveat:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
