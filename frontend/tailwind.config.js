/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  mode: "jit",
  content: [
    "./index.html",
    "./src/app/**/*.{js,ts,jsx,tsx}",   
    "./*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [],
  
};
