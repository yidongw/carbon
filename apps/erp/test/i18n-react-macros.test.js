"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var appRoot = node_path_1.default.resolve(__dirname, "../app");
var allowedExtensions = new Set([".ts", ".tsx"]);
var excludedSegments = [
    ".server.",
    ".test.",
    ".spec.",
    "".concat(node_path_1.default.sep, "locales").concat(node_path_1.default.sep)
];
function collectFiles(dir) {
    var files = [];
    var _loop_1 = function (entry) {
        var fullPath = node_path_1.default.join(dir, entry);
        var stats = (0, node_fs_1.statSync)(fullPath);
        if (stats.isDirectory()) {
            files.push.apply(files, collectFiles(fullPath));
            return "continue";
        }
        if (!allowedExtensions.has(node_path_1.default.extname(fullPath))) {
            return "continue";
        }
        if (excludedSegments.some(function (segment) { return fullPath.includes(segment); })) {
            return "continue";
        }
        files.push(fullPath);
    };
    for (var _i = 0, _a = (0, node_fs_1.readdirSync)(dir); _i < _a.length; _i++) {
        var entry = _a[_i];
        _loop_1(entry);
    }
    return files;
}
(0, vitest_1.describe)("Lingui React macro migration", function () {
    (0, vitest_1.it)("avoids msg-based translations in React-facing app files", function () {
        var offenders = [];
        for (var _i = 0, _a = collectFiles(appRoot); _i < _a.length; _i++) {
            var filePath = _a[_i];
            var source = (0, node_fs_1.readFileSync)(filePath, "utf8");
            var relativePath = node_path_1.default.relative(node_path_1.default.resolve(__dirname, ".."), filePath);
            if (source.includes('@lingui/core/macro') ||
                source.includes("from '@lingui/core/macro'") ||
                source.includes("_(msg") ||
                source.includes("t(msg(")) {
                offenders.push(relativePath);
            }
            if (source.includes("useLingui") &&
                (source.includes('from "@lingui/react"') ||
                    source.includes("from '@lingui/react'"))) {
                offenders.push(relativePath);
            }
        }
        (0, vitest_1.expect)(offenders).toEqual([]);
    });
});
