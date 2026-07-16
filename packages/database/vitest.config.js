"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: false,
        environment: "node",
        passWithNoTests: true,
        include: ["src/**/*.test.ts"],
        exclude: ["node_modules", "dist", ".turbo"],
    },
});
