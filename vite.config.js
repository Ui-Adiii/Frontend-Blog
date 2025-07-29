import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import scrollbar from "tailwind-scrollbar";

export default defineConfig({
  darkMode: "class",
  plugins: [react(), tailwindcss(), flowbiteReact(),scrollbar],
});
