import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        synapsLight: {
          "primary": "#4f46e5", // Indigo 600
          "secondary": "#9333ea", // Purple 600
          "accent": "#0ea5e9", // Sky 500
          "neutral": "#0f172a", // Slate 900
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        synapsDark: {
          "primary": "#6366f1", // Indigo 500
          "secondary": "#a855f7", // Purple 500
          "accent": "#38bdf8", // Sky 400
          "neutral": "#1e293b", // Slate 800
          "base-100": "#050508", // OriginKit very dark background
          "base-200": "#0f172a", // OriginKit slate 900
          "base-300": "#1e293b", // OriginKit slate 800
          "base-content": "#f8fafc", // Slate 50
          "info": "#38bdf8",
          "success": "#22c55e",
          "warning": "#fbbf24",
          "error": "#ef4444",
        }
      }
    ],
    darkTheme: "synapsDark",
  },
};
export default config;
