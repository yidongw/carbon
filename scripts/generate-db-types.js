"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_child_process_1 = require("node:child_process");
var node_path_1 = require("node:path");
var dotenv = require("dotenv");
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
var dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
    console.error("SUPABASE_DB_URL not set (expected in .env or .env.local). Run `pnpm dev:up` first.");
    process.exit(1);
}
if (!/(localhost|127\.0\.0\.1)/.test(dbUrl)) {
    console.error("Refusing to generate types against non-local DB: ".concat(dbUrl.replace(/:[^:@/]+@/, ":***@")));
    process.exit(1);
}
var parsedLocalDbUrl = new URL(dbUrl.replace("@localhost:", "@127.0.0.1:"));
parsedLocalDbUrl.searchParams.set("sslmode", "disable");
var localDbUrl = parsedLocalDbUrl.toString();
var typesPath = (0, node_path_1.join)("packages", "database", "src", "types.ts");
var fnTypesPath = (0, node_path_1.join)("packages", "database", "supabase", "functions", "lib", "types.ts");
var supabaseBin = (0, node_path_1.join)("node_modules", ".bin", "supabase");
// Pipe supabase stdout directly to the types file to avoid spawnSync's 1MB
// default buffer cap (generated types are ~MBs).
var tmpTypesPath = "".concat(typesPath, ".tmp");
var out = (0, node_fs_1.openSync)(tmpTypesPath, "w");
var r = (0, node_child_process_1.spawnSync)(supabaseBin, [
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
], { stdio: ["ignore", out, "inherit"] });
(0, node_fs_1.closeSync)(out);
if (r.status !== 0) {
    (0, node_fs_1.rmSync)(tmpTypesPath, { force: true });
    console.error("supabase gen types failed (exit ".concat(r.status, ")"));
    process.exit((_a = r.status) !== null && _a !== void 0 ? _a : 1);
}
var generatedTypes = (0, node_fs_1.readFileSync)(tmpTypesPath, "utf-8");
if (!generatedTypes.trimEnd().endsWith("} as const")) {
    (0, node_fs_1.rmSync)(tmpTypesPath, { force: true });
    console.error("supabase gen types produced incomplete output");
    process.exit(1);
}
(0, node_fs_1.renameSync)(tmpTypesPath, typesPath);
(0, node_fs_1.copyFileSync)(typesPath, fnTypesPath);
console.log("wrote ".concat(typesPath, "\nwrote ").concat(fnTypesPath));
