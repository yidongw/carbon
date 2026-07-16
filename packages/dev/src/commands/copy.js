"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStaleCopyFiles = syncStaleCopyFiles;
exports.envSync = envSync;
exports.copy = copy;
var node_fs_1 = require("node:fs");
var prompts_1 = require("@clack/prompts");
var pathe_1 = require("pathe");
var picocolors_1 = require("picocolors");
var git_js_1 = require("../git.js");
var helpers_js_1 = require("../helpers.js");
var DEFAULT_INCLUDES = [".env"];
// Auto-heal stale copy files: when main checkout's `.env` (or any file listed
// in package.json#crbn.copy) is newer than the worktree's, refresh it.
// `crbn checkout <existing-branch>` fast-paths past `do_post_create`, so
// existing worktrees never re-run `crbn env sync` and drift from main when new
// env vars/secrets land there. Returns the list of files actually copied.
function syncStaleCopyFiles(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var mainRoot, includes, copied, _i, includes_1, rel, src, dest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, git_js_1.mainCheckoutRoot)(cwd)];
                case 1:
                    mainRoot = _a.sent();
                    if (mainRoot === cwd)
                        return [2 /*return*/, []];
                    includes = readIncludes(mainRoot);
                    copied = [];
                    for (_i = 0, includes_1 = includes; _i < includes_1.length; _i++) {
                        rel = includes_1[_i];
                        src = (0, pathe_1.join)(mainRoot, rel);
                        dest = (0, pathe_1.join)(cwd, rel);
                        if (!(0, node_fs_1.existsSync)(src))
                            continue;
                        if ((0, helpers_js_1.isAtLeastAsNew)(dest, src))
                            continue;
                        (0, node_fs_1.copyFileSync)(src, dest);
                        copied.push(rel);
                    }
                    return [2 /*return*/, copied];
            }
        });
    });
}
// `crbn env sync` — copy files listed in package.json#crbn.copy from main.
function envSync() {
    return __awaiter(this, void 0, void 0, function () {
        var cwd, mainRoot, includes, copied, _i, includes_2, rel, src, dest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, prompts_1.intro)("Carbon · env sync");
                    cwd = process.cwd();
                    return [4 /*yield*/, (0, git_js_1.mainCheckoutRoot)()];
                case 1:
                    mainRoot = _a.sent();
                    if (mainRoot === cwd) {
                        prompts_1.log.warn("already in main checkout — nothing to sync");
                        (0, prompts_1.outro)("");
                        return [2 /*return*/];
                    }
                    includes = readIncludes(mainRoot);
                    copied = 0;
                    for (_i = 0, includes_2 = includes; _i < includes_2.length; _i++) {
                        rel = includes_2[_i];
                        src = (0, pathe_1.join)(mainRoot, rel);
                        dest = (0, pathe_1.join)(cwd, rel);
                        if (!(0, node_fs_1.existsSync)(src)) {
                            prompts_1.log.warn("".concat(picocolors_1.default.dim(rel), " missing in main checkout \u2014 skipped"));
                            continue;
                        }
                        (0, node_fs_1.copyFileSync)(src, dest);
                        prompts_1.log.info("".concat(picocolors_1.default.green("✓"), " ").concat(rel));
                        copied++;
                    }
                    (0, prompts_1.outro)("".concat(copied, " file").concat(copied === 1 ? "" : "s", " synced from ").concat(picocolors_1.default.dim(mainRoot)));
                    return [2 /*return*/];
            }
        });
    });
}
// `crbn copy <file> [file...]` — copy arbitrary files from main checkout.
function copy(files) {
    return __awaiter(this, void 0, void 0, function () {
        var cwd, mainRoot, copied, _i, files_1, file, rel, src, dest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, prompts_1.intro)("Carbon · copy");
                    cwd = process.cwd();
                    return [4 /*yield*/, (0, git_js_1.mainCheckoutRoot)()];
                case 1:
                    mainRoot = _a.sent();
                    if (mainRoot === cwd) {
                        prompts_1.log.warn("already in main checkout — nothing to copy");
                        (0, prompts_1.outro)("");
                        return [2 /*return*/];
                    }
                    if (files.length === 0) {
                        prompts_1.log.error("specify at least one file to copy from main checkout");
                        (0, prompts_1.outro)("");
                        process.exit(1);
                    }
                    copied = 0;
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        rel = (0, pathe_1.relative)(cwd, (0, pathe_1.join)(cwd, file));
                        src = (0, pathe_1.join)(mainRoot, rel);
                        dest = (0, pathe_1.join)(cwd, rel);
                        if (!(0, node_fs_1.existsSync)(src)) {
                            prompts_1.log.warn("".concat(picocolors_1.default.dim(rel), " missing in main checkout \u2014 skipped"));
                            continue;
                        }
                        (0, node_fs_1.mkdirSync)((0, pathe_1.dirname)(dest), { recursive: true });
                        (0, node_fs_1.copyFileSync)(src, dest);
                        prompts_1.log.info("".concat(picocolors_1.default.green("✓"), " ").concat(rel));
                        copied++;
                    }
                    (0, prompts_1.outro)("".concat(copied, " file").concat(copied === 1 ? "" : "s", " copied from ").concat(picocolors_1.default.dim(mainRoot)));
                    return [2 /*return*/];
            }
        });
    });
}
function readIncludes(mainRoot) {
    var _a;
    var pkgPath = (0, pathe_1.join)(mainRoot, "package.json");
    if (!(0, node_fs_1.existsSync)(pkgPath))
        return DEFAULT_INCLUDES;
    try {
        var pkg = JSON.parse((0, node_fs_1.readFileSync)(pkgPath, "utf8"));
        var list = (_a = pkg.crbn) === null || _a === void 0 ? void 0 : _a.copy;
        if (Array.isArray(list) && list.every(function (s) { return typeof s === "string"; })) {
            return list;
        }
        // biome-ignore lint/suspicious/noEmptyBlockStatements: ignored using `--suppress`
    }
    catch (_b) { }
    return DEFAULT_INCLUDES;
}
