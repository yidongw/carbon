"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ["vitest.mts"],
    format: ["esm"],
    outDir: "dist",
    clean: true,
    external: ["vitest", "vitest/config"],
});
