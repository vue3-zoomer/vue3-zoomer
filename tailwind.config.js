/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./.vitepress/**/*.{js,ts,vue,md}",
  ],

  theme: {
    extend: {
      boxShadow: {
        "inner-lg": "inset 0 0 20px 1px #0000004d",
      },
    },
  },

  plugins: [],
};
