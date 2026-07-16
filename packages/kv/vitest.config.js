"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var vitest_1 = require("@carbon/config/vitest");
exports.default = (0, config_1.mergeConfig)(vitest_1.default, (0, config_1.defineConfig)({
    test: {
        coverage: {
            include: ["src/ratelimit/**/*.ts"],
        },
    },
}));
