import type { Config } from "tailwindcss";

// Design tokens for the women's sports club:
// energetic Turquoise Blue + Wine Red/Burgundy palette, Vazirmatn font, RTL-friendly.
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-vazirmatn)", "Vazirmatn", "Tahoma", "sans-serif"],
      },
      colors: {
        // Brand palette — energetic turquoise blue (primary) + wine red accents
        primary: {
          DEFAULT: "#14b8a6", // turquoise
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        accent: {
          DEFAULT: "#881337", // wine red / burgundy for highlights
          light: "#fda4af",
        },
        cream: "#f8fafc", // very soft, clean gray-white background
        plum: "#134e4a", // main text color (deep turquoise, replaces old deep plum)
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(13, 148, 136, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
