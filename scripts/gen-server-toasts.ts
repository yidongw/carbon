import fs from "node:fs";
import path from "node:path";

/**
 * Scans the codebase for server-generated toast messages — the string literals
 * passed to the `success()` / `error()` Result builders from `@carbon/auth`
 * (`success(message, …)`, `error(cause, message)`) — and emits a Lingui `msg`
 * catalog so those English strings get extracted + translated. The browser
 * flash-toast middleware localizes each `result.message` via this map
 * (`translateServerToast`); unknown / dynamic (interpolated) messages pass
 * through as the English source.
 *
 * Mirrors scripts/gen-seed-display-names.ts. Runs in `lingui:extract:raw`
 * before `lingui extract`, and the pre-commit hook re-adds the output.
 */

const repoRoot = new URL("../", import.meta.url);
const outPath = new URL(
  "packages/react/src/serverToastMessages.ts",
  repoRoot
);

// Directories to scan. Server toasts live in `.server.ts` action files (which
// Lingui itself excludes) as well as shared packages, so we read the raw source
// ourselves rather than relying on Lingui's own extraction of these files.
const scanDirs = [
  "apps/erp/app",
  "apps/mes/app",
  "packages"
].map((d) => new URL(d + "/", repoRoot).pathname.replace(/\/$/, ""));

const IGNORE_DIR = new Set([
  "node_modules",
  "dist",
  "build",
  ".turbo",
  ".vercel",
  ".next"
]);

function walk(dir: string, out: string[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIR.has(entry.name)) continue;
      walk(full, out);
    } else if (
      /\.(ts|tsx)$/.test(entry.name) &&
      !/\.(test|spec)\./.test(entry.name) &&
      full !== outPath.pathname
    ) {
      out.push(full);
    }
  }
}

// --- lightweight arg parser -------------------------------------------------
// Given the index of the `(` that opens a call, return the top-level argument
// source strings (split on commas at paren-depth 1, ignoring commas inside
// nested (), strings, and template `${…}`). Returns null on an unbalanced call.
function parseCallArgs(src: string, openParen: number): string[] | null {
  const args: string[] = [];
  let depth = 0;
  let current = "";
  let i = openParen;
  // Track string / template state so commas & parens inside them don't count.
  let quote: string | null = null;
  const tmplExprStack: number[] = []; // paren depth captured when entering ${
  for (; i < src.length; i++) {
    const ch = src[i];
    const prev = src[i - 1];
    if (quote) {
      current += ch;
      if (ch === quote && prev !== "\\") {
        quote = null;
      } else if (quote === "`" && ch === "$" && src[i + 1] === "{") {
        // enter template expression
        current += "{";
        i++;
        tmplExprStack.push(depth);
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === "(") {
      depth++;
      if (depth === 1) {
        // this is the opening paren of the call itself — don't record it
        continue;
      }
      current += ch;
      continue;
    }
    if (ch === ")") {
      depth--;
      if (depth === 0) {
        args.push(current);
        return args;
      }
      current += ch;
      continue;
    }
    if (ch === "}" && tmplExprStack.length && depth === tmplExprStack[tmplExprStack.length - 1]) {
      // closing a template expression → back into the backtick string
      tmplExprStack.pop();
      quote = "`";
      current += ch;
      continue;
    }
    if (ch === "," && depth === 1 && tmplExprStack.length === 0) {
      args.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  return null; // unbalanced
}

// If `arg` (trimmed) is exactly one string literal, return its value; else null
// (dynamic expressions, concatenation, and interpolated templates are skipped).
function asStringLiteral(arg: string): string | null {
  const s = arg.trim();
  if (s.length < 2) return null;
  const q = s[0];
  if (q !== '"' && q !== "'" && q !== "`") return null;
  if (s[s.length - 1] !== q) return null;
  if (q === "`" && s.includes("${")) return null; // interpolated → dynamic
  // ensure the closing quote is the actual end (no unescaped quote before it)
  let value = "";
  for (let i = 1; i < s.length - 1; i++) {
    const ch = s[i];
    if (ch === "\\") {
      const next = s[i + 1];
      const map: Record<string, string> = {
        n: "\n",
        t: "\t",
        r: "\r",
        "\\": "\\",
        '"': '"',
        "'": "'",
        "`": "`"
      };
      value += map[next] ?? next;
      i++;
      continue;
    }
    if (ch === q) return null; // closed early → not a single literal
    value += ch;
  }
  return value;
}

function collect(
  src: string,
  fnName: string,
  messageArgIndex: number,
  into: Set<string>
) {
  // Bare identifier call only — exclude `.error(` / `console.error` / `myError`.
  const re = new RegExp(`(?<![.\\w])${fnName}\\s*\\(`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const openParen = m.index + m[0].length - 1;
    const args = parseCallArgs(src, openParen);
    if (!args) continue;
    const arg = args[messageArgIndex];
    if (arg == null) continue;
    const lit = asStringLiteral(arg);
    if (lit) into.add(lit);
  }
}

const files: string[] = [];
for (const dir of scanDirs) walk(dir, files);

const messages = new Set<string>();
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  if (
    !src.includes("success(") &&
    !src.includes("error(") &&
    !src.includes("itemPlanningSaveErrorMessage(")
  ) {
    continue;
  }
  collect(src, "success", 0, messages);
  collect(src, "error", 1, messages);
  // Fallback toast copy nested in error(cause, itemPlanningSaveErrorMessage(..., "…"))
  collect(src, "itemPlanningSaveErrorMessage", 1, messages);
}

// Defaults from the Result builders (their fallback param values aren't inline
// call arguments, so the scan can't see them). Also include Error/string
// messages returned from services and flashed via `error(cause, messageVar)`.
for (const extra of [
  "Request succeeded",
  "Request failed",
  "This item is configured by attributes — enter the per-variant breakdown before reporting.",
  "Reported quantity exceeds the remaining planned quantity for one or more variant combos.",
  "Style variants are missing for one or more attribute combos. Open the style and save attribute selections first.",
  "Open the variant quantities grid to assign quantities",
  "This style line already has production jobs. Remove or complete the jobs before changing its variant quantities."
]) {
  messages.add(extra);
}

const sorted = [...messages].sort((a, b) => a.localeCompare(b));
const esc = (str: string) =>
  str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

let out = `// GENERATED by scripts/gen-server-toasts.ts — do not edit by hand.
import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * English toast strings passed to the server-side \`success()\` / \`error()\`
 * Result builders (@carbon/auth). The server sends the English \`result.message\`;
 * the browser flash-toast middleware localizes it via \`translateServerToast()\`.
 * Regenerated by scripts/gen-server-toasts.ts so Lingui extracts + translates
 * every message; unknown / interpolated messages pass through as English.
 */
const serverToastMessages: Record<string, MessageDescriptor> = {
`;

const isValidIdentifier = (str: string) =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str);

out += sorted
  .map((n) => {
    const key = isValidIdentifier(n) ? n : JSON.stringify(n);
    return `  ${key}: msg\`${esc(n)}\``;
  })
  .join(",\n");
out += "\n};\n";

out += `
export function translateServerToast(
  message: string,
  i18n: { _: (descriptor: MessageDescriptor) => string }
): string {
  const descriptor = serverToastMessages[message];
  return descriptor != null ? i18n._(descriptor) : message;
}
`;

fs.writeFileSync(outPath.pathname, out);
console.log(
  `gen-server-toasts: ${sorted.length} messages -> ${path.relative(repoRoot.pathname, outPath.pathname)}`
);
