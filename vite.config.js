import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        about: path.resolve(__dirname, "about.html"),
        work: path.resolve(__dirname, "work.html"),
        contact: path.resolve(__dirname, "contact.html"),
        weather: path.resolve(__dirname, "weather-app.html"),
        meet: path.resolve(__dirname, "meet-app.html"),
        legal: path.resolve(__dirname, "legal-info.html"),
        cubReact: path.resolve(__dirname, "cub-react.html"),
        cubCase: path.resolve(__dirname, "cub-case-study.html"),
        cubAngular: path.resolve(__dirname, "cub-angular.html"),
        chat: path.resolve(__dirname, "chat-app.html"),
      },
    },
  },
});
