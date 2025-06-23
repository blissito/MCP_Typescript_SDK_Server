import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: "src/index.ts",
    client: "src/client.ts",
    hooks: "src/hooks/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom", "process", "http", "fs", "path", "ws"],
  outDir: "dist",
  target: "esnext",
  minify: false,
  platform: "node",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": "undefined",
    "process": "undefined"
  }
});
