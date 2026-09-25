import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/commerce.integration.spec.js"],
    maxWorkers: 1
  }
});
