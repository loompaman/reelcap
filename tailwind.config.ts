import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#0066FF',
          600: '#0052CC',
        },
        pink: {
          500: '#FF1F7D',
          600: '#E61B70',
        },
      },
    },
  },
  plugins: [],
};

export default config;
