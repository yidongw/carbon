#!/usr/bin/env node
// Guards against the migration-timestamp collisions that keep biting cross-branch
// syncs (e.g. dev's jobs-view-routing-progress vs upstream's line-item-sort-order,
// both stamped 20260513120000 -> the second one is silently skipped because Supabase
// keys migrations by the timestamp only).
//
// Two rules:
//   1. DUPLICATE timestamps across all migration files -> hard fail (always).
//   2. Newly-added migrations may not use a "round" HHMMSS ending in 0000
//      (e.g. 120000, 000000). Those are the values every branch hand-picks, so
//      they collide. Use a randomized HHMMSS (what `supabase migration new` gives).
//
// Usage:
//   node scripts/check-migration-timestamps.mjs            # dupes(all) + round(staged-added)
//   node scripts/check-migration-timestamps.mjs --base origin/main   # round(added vs base)
//   node scripts/check-migration-timestamps.mjs --all      # round(all files) too
import { readdirSync } from "node:fs";
import { execSync } from "node:child_process";

const MIG_DIR = "packages/database/supabase/migrations";
const TS_RE = /^(\d{14})_.*\.sql$/;

const argv = process.argv.slice(2);
const baseIdx = argv.indexOf("--base");
const base = baseIdx !== -1 ? argv[baseIdx + 1] : null;
const checkAll = argv.includes("--all");

const tsOf = (f) => f.match(TS_RE)?.[1] ?? null;
const isRound = (ts) => ts.slice(-4) === "0000"; // MM=00 & SS=00 -> hand-rounded hour

function allMigrations() {
  return readdirSync(MIG_DIR)
    .filter((f) => TS_RE.test(f))
    .sort();
}

function addedMigrations() {
  let out = "";
  try {
    out = base
      ? execSync(`git diff --name-only --diff-filter=AR ${base}...HEAD`, { encoding: "utf8" })
      : execSync(`git diff --cached --name-only --diff-filter=AR`, { encoding: "utf8" });
  } catch {
    return null; // git unavailable -> skip the "new files" rule
  }
  return out
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.startsWith(MIG_DIR) && p.endsWith(".sql"))
    .map((p) => p.split("/").pop());
}

const errors = [];
const files = allMigrations();

// Rule 1: duplicate timestamps (across everything)
const byTs = new Map();
for (const f of files) {
  const ts = tsOf(f);
  if (!ts) continue;
  byTs.set(ts, [...(byTs.get(ts) ?? []), f]);
}
for (const [ts, fs] of byTs) {
  if (fs.length > 1) {
    errors.push(`Duplicate migration timestamp ${ts}:\n    - ${fs.join("\n    - ")}`);
  }
}

// Rule 2: round HHMMSS on newly-added (or all, with --all) migrations
const targets = checkAll ? files : addedMigrations();
if (targets) {
  for (const f of targets) {
    const ts = tsOf(f);
    if (ts && isRound(ts)) {
      errors.push(
        `Round timestamp ${ts} in ${f} — HHMMSS ends in 0000.\n` +
          `    Every branch hand-picks round times (…120000/…000000), so they collide.\n` +
          `    Rename with a randomized HHMMSS, e.g. ${ts.slice(0, 8)}${String(
            10 + (Number(ts.slice(8, 10)) % 14)
          ).padStart(2, "0")}${String(Math.floor(Date.now() / 1000) % 60).padStart(2, "0")}${String(
            (Math.floor(Date.now() / 1000) * 7) % 60
          ).padStart(2, "0")}.`
      );
    }
  }
}

if (errors.length) {
  console.error(`\n✗ migration timestamp check failed (${errors.length}):\n`);
  for (const e of errors) console.error(`  • ${e}\n`);
  console.error(
    `Fix: create migrations with \`pnpm db:migrate:new <name>\` (randomized timestamp),\n` +
      `and never reuse or hand-round a timestamp. See llm/workflows/database-migration.md.\n`
  );
  process.exit(1);
}

console.log(`✓ migration timestamps OK (${files.length} files, no duplicates${targets ? `, ${targets.length} new checked` : ""}).`);
