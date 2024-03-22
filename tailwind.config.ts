import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
        


"primary": "#0043ff",
        


"secondary": "#96ac00",
        


"accent": "#9e4500",
        


"neutral": "#100400",
        


"base-100": "#1b2b36",
        


"info": "#0068cf",
        


"success": "#75c900",
        


"warning": "#d19c00",
        


"error": "#ff597a",
        },
      },
    ],
  },
};
export default config;
