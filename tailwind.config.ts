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
        headline: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        serif: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        sans: ['var(--font-sora)', 'Sora', 'sans-serif'],
        body: ['var(--font-sora)', 'Sora', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
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
          "primary": "#0055FF",
          "secondary": "#00F0FF",
          "accent": "#00F0FF",
          "neutral": "#0f172a",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          "info": "#00F0FF",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        synapsDark: {
          "primary": "#0055FF",
          "secondary": "#00F0FF",
          "accent": "#00F0FF",
          "neutral": "#1e293b",
          "base-100": "#08080a",
          "base-200": "#0d0d11",
          "base-300": "#1a1a24",
          "base-content": "#f8fafc",
          "info": "#00F0FF",
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
