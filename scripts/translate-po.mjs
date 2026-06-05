#!/usr/bin/env node
// Robust local translator for lingui .po catalogs.
//
// Why this exists instead of `linguito translate --llm`:
//   linguito translates every missing string, holds them all in memory, and
//   writes the catalogs only after the WHOLE batch succeeds — with a brittle
//   strict-JSON parse and no per-string retry. One bad response from a small
//   local model discards thousands of good translations. This script instead
//   translates each string independently and in parallel, retries individual
//   failures, preserves placeholders/whitespace, and writes each catalog
//   incrementally so progress is never lost. Re-running fills only what's left.
//
// Usage:
//   node scripts/translate-po.mjs                 # all locales
//   node scripts/translate-po.mjs path/to/x.po    # only the given catalog(s)
// Env:
//   OLLAMA_URL (default http://127.0.0.1:11434), OLLAMA_MODEL (default llama3.2:latest),
//   TRANSLATE_CONCURRENCY (default 6)
import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "node:fs/promises";
import PO from "pofile";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "llama3.2:latest";
const CONCURRENCY = Number(process.env.TRANSLATE_CONCURRENCY ?? 6);
// Temperatures tried per string, in order. Escalating gives the model varied
// chances to produce a placeholder-valid output instead of repeating the same
// wrong answer deterministically.
const TEMPS = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0];
const SOURCE_LOCALE = "en";
const DEFAULT_GLOB = "packages/locale/locales/*/*.po";

const LOCALE_NAMES = {
  es: "Spanish", de: "German", it: "Italian", ja: "Japanese",
  zh: "Simplified Chinese", fr: "French", pl: "Polish",
  pt: "Portuguese", ru: "Russian", hi: "Hindi",
};

// NOTE: deliberately do NOT write literal placeholder tokens (like brace-zero)
// in this prompt — small models parrot such examples straight into the output.
// Describe placeholders abstractly instead.
const SYSTEM = `You are a professional UI localization engine for a manufacturing ERP/MES web application.
Translate the user-interface string the user gives you into the requested target language.
STRICT RULES:
- Output ONLY the translated string itself. No quotes, no commentary, no notes, no explanations, no examples.
- Some strings contain placeholders (words or numbers inside curly braces, percent-sign tokens) or formatting tags (numbered angle brackets). Reproduce every such placeholder and tag exactly as it appears in the source, in the same position. Never translate the text inside them.
- Do NOT add any placeholder or tag that is not already present in the source. If the source has none, your output must have none.
- Keep it concise and natural for a UI label/button/message.
- Do not add surrounding quotation marks or trailing punctuation that is not in the source.`;

const placeholders = (s) => (s.match(/\{[^{}]*\}|<\/?\d+\/?>|%[sd]/g) ?? []).slice().sort();

function placeholdersMatch(src, out) {
  const a = placeholders(src), b = placeholders(out);
  if (a.length !== b.length) return false;
  return a.every((x, i) => x === b[i]);
}

// Force the source's exact leading/trailing whitespace onto the output.
function matchOuterWhitespace(src, out) {
  const lead = (src.match(/^\s*/) ?? [""])[0];
  const trail = (src.match(/\s*$/) ?? [""])[0];
  return lead + out.replace(/^\s+|\s+$/g, "") + trail;
}

function clean(out) {
  let s = out.trim();
  // strip wrapping triple/single/double quotes or backticks the model may add
  s = s.replace(/^"""([\s\S]*)"""$/, "$1");
  s = s.replace(/^[`"']([\s\S]*)[`"']$/, "$1");
  return s.trim();
}

async function callOllama(text, localeName, temperature) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      options: { temperature },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Target language: ${localeName}\nString to translate:\n${text}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`ollama HTTP ${res.status}`);
  const json = await res.json();
  return clean(json.message?.content ?? "");
}

async function translateOne(src, localeName) {
  for (const temperature of TEMPS) {
    try {
      let out = await callOllama(src, localeName, temperature);
      if (!out) continue;
      out = matchOuterWhitespace(src, out);
      if (out.trim() && placeholdersMatch(src, out)) return out;
    } catch {
      /* network/parse hiccup — try next temperature */
    }
  }
  return null;
}

async function pool(items, n, worker) {
  let idx = 0, done = 0;
  const total = items.length;
  const tick = () => {
    done++;
    if (done % 10 === 0 || done === total) process.stdout.write(`\r    ${done}/${total}   `);
  };
  const run = async () => {
    while (idx < items.length) {
      const i = idx++;
      await worker(items[i]);
      tick();
    }
  };
  await Promise.all(Array.from({ length: Math.min(n, items.length || 1) }, run));
  if (total) process.stdout.write("\n");
}

const argPaths = process.argv.slice(2);
let totalTranslated = 0, totalFailed = 0;
const failedSamples = [];

const paths = [];
if (argPaths.length) paths.push(...argPaths);
else for await (const p of glob(DEFAULT_GLOB)) paths.push(p);
paths.sort();

for (const path of paths) {
  const locale = path.split("/").slice(-2)[0];
  if (locale === SOURCE_LOCALE) continue;
  const localeName = LOCALE_NAMES[locale];
  if (!localeName) { console.log(`skip unknown locale: ${locale} (${path})`); continue; }

  const po = PO.parse(readFileSync(path, "utf8"));
  const missing = po.items.filter(
    (it) => !it.obsolete && it.msgid &&
      (!it.msgstr || it.msgstr.length === 0 || it.msgstr.every((s) => s === "")),
  );
  if (missing.length === 0) continue;

  console.log(`\n${path} — ${missing.length} strings → ${localeName}`);
  let okThisFile = 0;
  await pool(missing, CONCURRENCY, async (item) => {
    const out = await translateOne(item.msgid, localeName);
    if (out) { item.msgstr = [out]; okThisFile++; totalTranslated++; }
    else {
      totalFailed++;
      if (failedSamples.length < 10) failedSamples.push(`${locale}: ${JSON.stringify(item.msgid)}`);
    }
  });
  writeFileSync(path, po.toString());
  console.log(`    wrote ${path} (+${okThisFile}/${missing.length})`);
}

console.log(`\nDone. translated=${totalTranslated} failed=${totalFailed}`);
if (failedSamples.length) {
  console.log("Failed samples (left empty, re-run to retry):");
  failedSamples.forEach((s) => console.log("  " + s));
}
