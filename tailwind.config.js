/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },
        surface: {
          light: "#ffffff",
          dark: "#111827",
        },
      },
      boxShadow: {
        card: "0 4px 16px -4px rgba(0,0,0,0.15)",
        cardHover: "0 8px 28px -6px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl: "1rem",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(.16,.84,.44,1)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};