import fs from "node:fs";

const seedPath = new URL(
  "../packages/database/supabase/functions/lib/seed.data.ts",
  import.meta.url
);
const outPath = new URL(
  "../apps/erp/app/utils/seedDataDisplayName.ts",
  import.meta.url
);

const s = fs.readFileSync(seedPath, "utf8");
const re = /\bname:\s*"((?:[^"\\]|\\.)*)"/g;
const set = new Set<string>();
let m: RegExpExecArray | null;
while ((m = re.exec(s))) {
  try {
    set.add(JSON.parse(`"${m[1].replace(/\\"/g, '"')}"`) as string);
  } catch {
    set.add(m[1]);
  }
}

const names = [...set].sort((a, b) => a.localeCompare(b));
const esc = (str: string) =>
  str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

let out = `import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * English display names from seed data (packages/database/supabase/functions/lib/seed.data.ts).
 * Use with translateSeedDisplayName() so locales can translate seeded defaults; unknown names pass through.
 */
const seedDisplayNameMessages: Record<string, MessageDescriptor> = {
`;

for (const n of names) {
  out += `  ${JSON.stringify(n)}: msg\`${esc(n)}\`,\n`;
}

out += `};

export function translateSeedDisplayName(
  name: string,
  i18n: { _: (descriptor: MessageDescriptor) => string }
): string {
  const descriptor = seedDisplayNameMessages[name];
  return descriptor != null ? i18n._(descriptor) : name;
}
`;

fs.writeFileSync(outPath, out);
