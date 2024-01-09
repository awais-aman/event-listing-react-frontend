import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.PORT) || 3001;

  return {
    plugins: [react()],
    server: { port, host: true },
    preview: { port, host: true },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      css: false,
      env: { VITE_API_BASE_URL: "http://api.test" },
    },
  };
});
