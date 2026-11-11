import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    env: {
      API_KEY_AUTH: "test-key",
      IA_TOKEN_TAVILY: "test-tavily-token",
    },
  },
});
