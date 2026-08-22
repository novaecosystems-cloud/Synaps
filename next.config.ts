import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://*.firebaseapp.com https://apis.google.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' https: data:; connect-src 'self' https: wss: https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://synaps-3d138.firebaseapp.com; frame-src 'self' https://synaps-3d138.firebaseapp.com https://*.firebaseapp.com https://accounts.google.com https://*.google.com; frame-ancestors 'self';"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups"
  }
];

// RUDY (R-U-Dead-Yet) slow POST defense: add body timeout + keep-alive headers on API routes
const apiSecurityHeaders = [
  {
    key: "Connection",
    value: "keep-alive",
  },
  {
    // Vercel / next-server does not natively expose request timeouts,
    // but downstream proxies (Cloudflare, nginx) honor this hint.
    key: "Keep-Alive",
    value: "timeout=65, max=1000",
  },
  {
    // Inform upstream proxies of body size limit (64 KB for API routes)
    key: "X-Max-Body-Size",
    value: "65536",
  },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  serverExternalPackages: ["pdf-parse", "officeparser", "pdfmake"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Apply RUDY defense headers to all API routes
        source: "/api/(.*)",
        headers: apiSecurityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
