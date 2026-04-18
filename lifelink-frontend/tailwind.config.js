/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f8ff",
          100: "#dfefff",
          200: "#bedfff",
          300: "#8cc8ff",
          400: "#52a9ff",
          500: "#2d8dff",
          600: "#1a6fe4",
          700: "#1659c7",
          800: "#184ba3",
          900: "#1b4280",
        },
        mint: {
          50: "#effef8",
          100: "#d7fced",
          200: "#b2f8de",
          300: "#7af1c8",
          400: "#3de0a9",
          500: "#19c18d",
          600: "#0d9b72",
          700: "#0d7b5c",
          800: "#10614a",
          900: "#0f503e",
        },
      },
      boxShadow: {
        soft: "0 12px 40px rgba(12, 54, 93, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 480ms ease-out both",
      },
    },
  },
  plugins: [],
}
