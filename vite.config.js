import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        tutors: resolve(__dirname, "tutors.html"),
        tutorDetails: resolve(__dirname, "tutor-details.html"),
        favourites: resolve(__dirname, "favourites.html"),
        becomeTutor: resolve(__dirname, "become-tutor.html")
      }
    }
  }
});
