import { Config } from "tailwindcss";
import daisyui from 'daisyui';


const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      colors: {

        blue: "#0d6efd",
        indigo: "#6610f2",
        purple: "#6f42c1",
        pink: "#d63384",
        red: "#dc3545",
        orange: "#fd7e14",
        yellow: "#ffc107",
        green: "#198754",
        teal: "#20c997",
        cyan: "#0dcaf0",
        white: "#fff",
        gray: {
          default: "#6c757d",
          dark: "#343a40",
          bright: "#E9F3EE"
        },


        primary: "#29AE61",
        secondary: "#8c000d",
        success: "#198754",
        info: "#0dcaf0",
        warning: "#dfa806",
        danger: "#dc3545",
        light: "#dddddd",
        dark: "#212529",
        ColumbiaBlue: "#c8ecda",

      },
      fontFamily: {
        "work-sans": ["var(--font-work-sans)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        100: "2px 2px 0px 0px rgb(0, 0, 0)",
        200: "2px 2px 0px 2px rgb(0, 0, 0)",
        300: "2px 2px 0px 2px rgb(238, 43, 105)",
      },
    },
  },
  plugins: [daisyui,],
};

export default config;