import { configDefaults } from "vitest/config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      name: "setup",
      config: () => ({
        test: {
          setupFiles: ["./setupVitest.ts"],
        },
      }),
    },
  ],
  resolve: {
    alias: {
      // "@common": resolve("../common/src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
  },
  test: {
    include: ["./src/**/*.test.[jt]s"],
    exclude: [...configDefaults.exclude],
    globals: true,
    testTimeout: 3000,
    reporters: ["basic"],
    passWithNoTests: true,
    logHeapUsage: true,
  },
});
