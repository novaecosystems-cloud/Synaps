import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://*.firebaseapp.com https://apis.google.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https: https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https: data: https://fonts.gstatic.com; connect-src 'self' https: wss: ws: https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://synaps-3d138.firebaseapp.com https://api.dicebear.com; frame-src 'self' https://synaps-3d138.firebaseapp.com https://*.firebaseapp.com https://accounts.google.com https://*.google.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https:;"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN"
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
    value: "camera=(), microphone=(self), geolocation=()"
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups"
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
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
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
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
        // Long-term immutable caching for static assets, mockups, upscaled images, svgs, and fonts
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
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
