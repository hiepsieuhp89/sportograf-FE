import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)"],
      },
      colors: {
        mainBackgroundV1: "#DFDFF2",
        mainDarkBackgroundV1: "#151818",
        mainActiveV1: "#EDFF66",
        mainSecondaryActiveV1: "#5542FF",
        mainHoverV1: "#213241",
        mainBorderV1: "#314B61",
        mainTextV1: "#BDCEDD",
        mainNavyText: "#1E4A6D",
        mainCardV1: "#2B4154",
        secondaryTextV1: "#687D92",
        mainTextHoverV1: "#604AE3",
        mainSuccessV1: "#5CC184",
        mainSuccessHoverV1: "#53AE77",
        mainWarningV1: "#F0934E",
        mainWarningHoverV1: "#D88446",
        mainDangerV1: "#E66666",
        mainDangerHoverV1: '#D25D5D',
        mainInfoV1: "#45C5CD",
        mainInfoHoverV1: "#3EB1B9",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sportograf: {
          blue: "#1e3a52",
          darkblue: "#0f1923", // Original dark blue
          navyblue: "#111827", // Even darker blue for footer
          red: "#e53e3e",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      perspective: {
        "1000": "1000px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }: { addUtilities: any }) => {
      const newUtilities = {
        ".perspective-1000": {
          perspective: "1000px",
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config
