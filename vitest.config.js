import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: "./wrangler.toml" },
      miniflare: {
        bindings: {
          OPENAI_API_KEY: "test-openai-key",
          ADMIN_API_KEY: "test-admin-key",
          RATE_LIMIT_SALT: "test-rate-salt"
        }
      }
    })
  ],
  test: {
    setupFiles: [path.resolve("test/setup.js")],
    pool: "workers",
    poolOptions: { workers: { isolatedStorage: true } },
    maxWorkers: 1
  }
});
