import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    base: env.VITE_APP_BASE_PREFIX || "/",

    server: {
      port: 3001,
      host: true,
      open: true,
    },

    build: {
      outDir: "build/bookingcms",
      emptyOutDir: true,
    },
  };
});
