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
exports.newWorktree = newWorktree;
var node_fs_1 = require("node:fs");
var prompts_1 = require("@clack/prompts");
var pathe_1 = require("pathe");
var picocolors_1 = require("picocolors");
var git_js_1 = require("../git.js");
var prompts_js_1 = require("../prompts.js");
var worktree_js_1 = require("../worktree.js");
function newWorktree(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var here, parentDir, repoBaseName, branch, defaultDir, dirName, targetPath, cur, baseRef, copyEnv, targetFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, prompts_1.intro)("Carbon · new worktree");
                    return [4 /*yield*/, (0, worktree_js_1.getWorktreeRoot)()];
                case 1:
                    here = _a.sent();
                    parentDir = (0, pathe_1.dirname)(here);
                    repoBaseName = (0, pathe_1.basename)(here).replace(/-[a-z0-9-]+$/i, "");
                    return [4 /*yield*/, (0, prompts_js_1.promptBranch)(opts === null || opts === void 0 ? void 0 : opts.branch)];
                case 2:
                    branch = _a.sent();
                    defaultDir = "".concat(repoBaseName, "-").concat((0, worktree_js_1.slugify)(branch));
                    return [4 /*yield*/, (0, prompts_js_1.promptDirName)(parentDir, defaultDir)];
                case 3:
                    dirName = _a.sent();
                    targetPath = (0, pathe_1.resolve)(parentDir, dirName);
                    return [4 /*yield*/, (0, git_js_1.currentBranch)(here)];
                case 4:
                    cur = _a.sent();
                    return [4 /*yield*/, (0, prompts_js_1.promptBaseRef)(cur || null)];
                case 5:
                    baseRef = _a.sent();
                    return [4 /*yield*/, (0, prompts_js_1.promptCopyEnv)()];
                case 6:
                    copyEnv = _a.sent();
                    return [4 /*yield*/, (0, prompts_1.tasks)(__spreadArray([
                            {
                                title: "git worktree add ".concat(dirName),
                                task: function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                msg("branching from ".concat(baseRef));
                                                return [4 /*yield*/, (0, git_js_1.addWorktree)({ path: targetPath, branch: branch, baseRef: baseRef })];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, "worktree at ".concat((0, pathe_1.relative)(here, targetPath))];
                                        }
                                    });
                                }); }
                            }
                        ], (copyEnv
                            ? [
                                {
                                    title: "Copy .env",
                                    task: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var src;
                                        return __generator(this, function (_a) {
                                            src = (0, pathe_1.join)(here, ".env");
                                            if (!(0, node_fs_1.existsSync)(src))
                                                return [2 /*return*/, "no .env in source — skipped"];
                                            (0, node_fs_1.copyFileSync)(src, (0, pathe_1.join)(targetPath, ".env"));
                                            return [2 /*return*/, ".env copied"];
                                        });
                                    }); }
                                }
                            ]
                            : []), true))];
                case 7:
                    _a.sent();
                    targetFile = process.env.CRBN_NEW_TARGET;
                    if (targetFile) {
                        (0, node_fs_1.writeFileSync)(targetFile, targetPath);
                    }
                    (0, prompts_1.outro)("worktree ready \u2014 ".concat(picocolors_1.default.cyan("crbn up"), " to boot it"));
                    return [2 /*return*/];
            }
        });
    });
}
