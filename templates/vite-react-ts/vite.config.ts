import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { sourcemap: true },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./testSetup.ts",
    include: ["src/**/*.test.(ts|tsx)"],
  },
});
