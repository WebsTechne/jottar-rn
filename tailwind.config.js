const { hairlineWidth } = require("nativewind/theme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
          foreground51: "hsl(var(--muted-foreground-51))",
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
        "chart-1": {
          DEFAULT: "hsl(var(--chart-1) / <alpha-value>)",
        },
        "chart-2": {
          DEFAULT: "hsl(var(--chart-2) / <alpha-value>)",
        },
        "chart-3": {
          DEFAULT: "hsl(var(--chart-3) / <alpha-value>)",
        },
        "chart-4": {
          DEFAULT: "hsl(var(--chart-4) / <alpha-value>)",
        },
        "chart-5": {
          DEFAULT: "hsl(var(--chart-5) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      fontFamily: {
        sans: "Raleway_400Regular",
        mono: "GeistMono_400Regular",
        monoBold: "GeistMono_700Bold",
        medium: "Raleway_500Medium",
        semibold: "Raleway_600SemiBold",
        bold: "Raleway_700Bold",
        extrabold: "Raleway_800ExtraBold",
      },
      fontWeight: {
        normal: undefined,
        medium: undefined,
        semibold: undefined,
        bold: undefined,
        extrabold: undefined,
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
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".flex-center": {
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
        },
      };
      addUtilities(newUtilities);
    }),
    require("tailwindcss-animate"),
  ],
};
