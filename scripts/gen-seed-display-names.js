"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var seedPath = new URL("../packages/database/supabase/functions/lib/seed.data.ts", import.meta.url);
var outPath = new URL("../apps/erp/app/utils/seedDataDisplayName.ts", import.meta.url);
var s = node_fs_1.default.readFileSync(seedPath, "utf8");
var re = /\bname:\s*"((?:[^"\\]|\\.)*)"/g;
var set = new Set();
var m;
while ((m = re.exec(s))) {
    try {
        set.add(JSON.parse("\"".concat(m[1].replace(/\\"/g, '"'), "\"")));
    }
    catch (_a) {
        set.add(m[1]);
    }
}
var names = __spreadArray([], set, true).sort(function (a, b) { return a.localeCompare(b); });
var esc = function (str) {
    return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
};
var out = "import type { MessageDescriptor } from \"@lingui/core\";\nimport { msg } from \"@lingui/core/macro\";\n\n/**\n * English display names from seed data (packages/database/supabase/functions/lib/seed.data.ts).\n * Use with translateSeedDisplayName() so locales can translate seeded defaults; unknown names pass through.\n */\nconst seedDisplayNameMessages: Record<string, MessageDescriptor> = {\n";
var isValidIdentifier = function (str) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str);
};
out += names
    .map(function (n) {
    var key = isValidIdentifier(n) ? n : JSON.stringify(n);
    return "  ".concat(key, ": msg`").concat(esc(n), "`");
})
    .join(",\n");
out += "\n";
out += "};\n\nexport function translateSeedDisplayName(\n  name: string,\n  i18n: { _: (descriptor: MessageDescriptor) => string }\n): string {\n  const descriptor = seedDisplayNameMessages[name];\n  return descriptor != null ? i18n._(descriptor) : name;\n}\n";
node_fs_1.default.writeFileSync(outPath, out);
