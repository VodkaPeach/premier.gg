import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Mirror the tsconfig `@/* -> ./src/*` path alias for the vitest/vite runtime.
  // tsc honours tsconfig paths directly, but vite needs an explicit resolve.alias.
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});
