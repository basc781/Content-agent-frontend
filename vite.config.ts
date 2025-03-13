import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Required for Docker
    port: 5173,
    watch: {
      usePolling: true, // Better for Docker
    },
  },
  preview: {
    port: 5173,
    host: true,
    allowedHosts: ["content-agent.nl", "www.content-agent.nl"],
  },
});
