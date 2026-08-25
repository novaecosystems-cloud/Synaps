import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Sora, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import AppUpdateNotifier from "@/components/AppUpdateNotifier";
import OfflineNetworkGuardian from "@/components/OfflineNetworkGuardian";
import GlobalHotkeys from "@/components/GlobalHotkeys";
import CommandPalette from "@/components/CommandPalette";
import { getOpenSEOMetadata, getSoftwareApplicationJsonLd } from "@/lib/openseo";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  ...getOpenSEOMetadata(),
  verification: {
    google: "0f4930e9950c5fc4",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0055FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable} ${sora.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Load Fraunces, Source Serif 4, Sora, JetBrains Mono, Modak & Mouse Memoirs with preconnect & preload to eliminate CLS and optimize LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Sora:wght@100..800&family=JetBrains+Mono:wght@400;500;700&family=Modak&family=Mouse+Memoirs&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=Sora:wght@100..800&family=JetBrains+Mono:wght@400;500;700&family=Modak&family=Mouse+Memoirs&display=swap"
          rel="stylesheet"
        />
        {/* Microsoft Clarity Analytics Script */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
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
      <body className="antialiased selection:bg-blue-600 selection:text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Sora', sans-serif" }}>
        {/* WCAG 2.4.1 Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-2xl focus:ring-2 focus:ring-white focus:outline-none transition-all"
        >
          Skip to main content
        </a>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {/* <MicrosoftClarity /> */}
            <div id="main-content">
              {children}
            </div>
            <CommandPalette />
            <GlobalHotkeys />
            <Toaster />
            <Analytics />
            <AppUpdateNotifier />
            <OfflineNetworkGuardian />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
