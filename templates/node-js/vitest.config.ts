import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
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
    test: {
      include: ["./src/**/*.test.[jt]s"],
      exclude: [...configDefaults.exclude],
      globals: true,
      testTimeout: 3000,
      reporters: ["basic"],
      passWithNoTests: true,
      logHeapUsage: true,
    },
  })
);
