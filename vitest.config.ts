import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./test/setup.ts"],
    include: [
      "test/**/*.test.ts",
      "test/**/*.spec.ts",
      "**/*.test.ts",
      "**/*.spec.ts",
    ],
    exclude: ["node_modules/**", "dist/**", "**/*.d.ts"],
    testTimeout: 60000,
    hookTimeout: 60000,
    teardownTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": "./src",
    },
  },
});
