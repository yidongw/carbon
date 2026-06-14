import {
  closeSync,
  copyFileSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error(
    "SUPABASE_DB_URL not set (expected in .env or .env.local). Run `pnpm dev:up` first."
  );
  process.exit(1);
}

if (!/(localhost|127\.0\.0\.1)/.test(dbUrl)) {
  console.error(
    `Refusing to generate types against non-local DB: ${dbUrl.replace(/:[^:@/]+@/, ":***@")}`
  );
  process.exit(1);
}

const parsedLocalDbUrl = new URL(dbUrl.replace("@localhost:", "@127.0.0.1:"));
parsedLocalDbUrl.searchParams.set("sslmode", "disable");
const localDbUrl = parsedLocalDbUrl.toString();

const typesPath = join("packages", "database", "src", "types.ts");
const fnTypesPath = join(
  "packages",
  "database",
  "supabase",
  "functions",
  "lib",
  "types.ts"
);
const supabaseBin = join("node_modules", ".bin", "supabase");

// Pipe supabase stdout directly to the types file to avoid spawnSync's 1MB
// default buffer cap (generated types are ~MBs).
const tmpTypesPath = `${typesPath}.tmp`;
const out = openSync(tmpTypesPath, "w");
const r = spawnSync(
  supabaseBin,
  [
    "gen",
    "types",
    "typescript",
    "--db-url",
    localDbUrl,
    "--schema",
    "public",
    "--schema",
    "storage",
    "--schema",
    "graphql_public"
  ],
  { stdio: ["ignore", out, "inherit"] }
);
closeSync(out);

if (r.status !== 0) {
  rmSync(tmpTypesPath, { force: true });
  console.error(`supabase gen types failed (exit ${r.status})`);
  process.exit(r.status ?? 1);
}

const generatedTypes = readFileSync(tmpTypesPath, "utf-8");
if (!generatedTypes.trimEnd().endsWith("} as const")) {
  rmSync(tmpTypesPath, { force: true });
  console.error("supabase gen types produced incomplete output");
  process.exit(1);
}

renameSync(tmpTypesPath, typesPath);
copyFileSync(typesPath, fnTypesPath);
console.log(`wrote ${typesPath}\nwrote ${fnTypesPath}`);
