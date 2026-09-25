import { env } from "cloudflare:workers";
import { readD1Migrations, applyD1Migrations } from "@cloudflare/vitest-plugin";
import path from "node:path";

const migrations = await readD1Migrations(path.resolve("migrations"));
await applyD1Migrations(env.DB, migrations);
