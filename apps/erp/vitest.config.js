"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        include: ["app/**/*.test.ts", "app/**/*.test.tsx", "test/**/*.test.ts"],
        passWithNoTests: true
    }
});
