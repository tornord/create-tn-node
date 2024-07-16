import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {},
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
  },
});
