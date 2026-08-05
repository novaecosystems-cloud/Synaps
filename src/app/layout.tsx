import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import AppUpdateNotifier from "@/components/AppUpdateNotifier";
import { getSoftwareApplicationJsonLd } from "@/lib/openseo";

export const metadata: Metadata = {
  title: "Synaps AI — 3D Corporate Memory & 10-Agent AI Boardroom",
  description: "Synaps AI transforms complex document libraries into an interactive 3D Knowledge Graph and a 10-Agent AI C-Suite Boardroom.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6b8ab4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Load Syne, Unbounded, Space Grotesk & Plus Jakarta Sans via direct Google Fonts link */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Unbounded:wght@700;800;900&family=Space+Grotesk:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Microsoft Clarity Analytics Script Fallback */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a]||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xuccocifvr");
            `,
          }}
        />
        {/* OpenSEO Schema.org JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSoftwareApplicationJsonLd())
          }}
        />
      </head>
      <body className="antialiased selection:bg-black selection:text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <MicrosoftClarity />
            {children}
            <Toaster />
            <Analytics />
            <CookieConsentBanner />
            <AppUpdateNotifier />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
