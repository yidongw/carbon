#!/usr/bin/env node
// Strip churny metadata from .po files after `lingui extract`.
// - POT-Creation-Date: changes every run, conflicts on every PR.
// - `#: path:lineno` origins: shift whenever any upstream code moves and account
//   for ~half the diff in our .po files.
// These were previously dropped via formatter({ origins: false }) in
// lingui.config.js, but that object format breaks tooling that requires
// `format: "po"` (e.g. linguito). So the config keeps the string format and we
// strip the noise here instead.
import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "node:fs/promises";

const CATALOG_GLOB = "packages/locale/locales/*/*.po";

let touched = 0;
for await (const path of glob(CATALOG_GLOB)) {
  const src = readFileSync(path, "utf8");
  const out = src
    .replace(/^"POT-Creation-Date: .*\\n"\n/m, "") // header date
    .replace(/^#:.*\n/gm, ""); // origin reference lines
  if (out !== src) {
    writeFileSync(path, out);
    touched += 1;
  }
}
console.log(`strip-po-headers: ${touched} file(s) normalized`);
