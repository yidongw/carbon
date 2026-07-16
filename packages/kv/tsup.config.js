"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsup_1 = require("tsup");
var isProduction = process.env.VERCEL_ENV === "production";
exports.default = (0, tsup_1.defineConfig)({
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    minify: isProduction,
    sourcemap: !isProduction,
});
