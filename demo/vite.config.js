import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
  },
  define: {
    // Make environment variables available to the client
    "process.env": process.env,
  },
});
