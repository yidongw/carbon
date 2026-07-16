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
exports.mainCheckoutRoot = mainCheckoutRoot;
exports.isLinkedWorktree = isLinkedWorktree;
exports.currentBranch = currentBranch;
exports.listWorktrees = listWorktrees;
exports.addWorktree = addWorktree;
exports.removeWorktree = removeWorktree;
exports.isDirty = isDirty;
exports.branchExists = branchExists;
exports.refConflict = refConflict;
exports.deleteBranch = deleteBranch;
var execa_1 = require("execa");
var pathe_1 = require("pathe");
// Main checkout root — `--git-common-dir`'s parent. Works from any worktree.
function mainCheckoutRoot() {
    return __awaiter(this, arguments, void 0, function (cwd) {
        var r;
        if (cwd === void 0) { cwd = process.cwd(); }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("git", ["rev-parse", "--git-common-dir"], {
                        cwd: cwd,
                        reject: false
                    })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        throw new Error("not inside a git repository");
                    }
                    return [2 /*return*/, (0, pathe_1.dirname)((0, pathe_1.resolve)(cwd, r.stdout.trim()))];
            }
        });
    });
}
function isLinkedWorktree() {
    return __awaiter(this, arguments, void 0, function (cwd) {
        var _a, a, b;
        if (cwd === void 0) { cwd = process.cwd(); }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, execa_1.execa)("git", ["rev-parse", "--git-dir"], { cwd: cwd, reject: false }),
                        (0, execa_1.execa)("git", ["rev-parse", "--git-common-dir"], { cwd: cwd, reject: false })
                    ])];
                case 1:
                    _a = _b.sent(), a = _a[0], b = _a[1];
                    if (a.exitCode !== 0 || b.exitCode !== 0)
                        return [2 /*return*/, false];
                    return [2 /*return*/, (0, pathe_1.resolve)(cwd, a.stdout.trim()) !== (0, pathe_1.resolve)(cwd, b.stdout.trim())];
            }
        });
    });
}
function currentBranch() {
    return __awaiter(this, arguments, void 0, function (cwd) {
        var r, out, _a;
        if (cwd === void 0) { cwd = process.cwd(); }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, execa_1.execa)("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
                            cwd: cwd
                        })];
                case 1:
                    r = _b.sent();
                    out = r.stdout.trim();
                    return [2 /*return*/, out === "HEAD" ? "" : out];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, ""];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function listWorktrees() {
    return __awaiter(this, void 0, void 0, function () {
        var r, cwd, blocks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("git", ["worktree", "list", "--porcelain"])];
                case 1:
                    r = _a.sent();
                    cwd = process.cwd();
                    blocks = r.stdout.trim().split("\n\n");
                    return [2 /*return*/, blocks.map(function (block) {
                            var lines = block.split("\n");
                            var get = function (key) { var _a, _b; return (_b = (_a = lines.find(function (l) { return l.startsWith("".concat(key, " ")); })) === null || _a === void 0 ? void 0 : _a.slice(key.length + 1)) !== null && _b !== void 0 ? _b : ""; };
                            var path = get("worktree");
                            var branchLine = lines.find(function (l) { return l.startsWith("branch "); });
                            var branch = branchLine
                                ? branchLine.slice("branch refs/heads/".length)
                                : null;
                            return {
                                path: path,
                                branch: branch,
                                head: get("HEAD"),
                                bare: lines.includes("bare"),
                                current: path === cwd
                            };
                        })];
            }
        });
    });
}
function addWorktree(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("git", ["worktree", "add", "-b", opts.branch, opts.path, opts.baseRef], { reject: false })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        throw new Error((r.stderr || r.stdout || "git worktree add failed").trim());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function removeWorktree(path_1) {
    return __awaiter(this, arguments, void 0, function (path, force) {
        var args, r;
        if (force === void 0) { force = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = ["worktree", "remove"];
                    if (force)
                        args.push("--force");
                    args.push(path);
                    return [4 /*yield*/, (0, execa_1.execa)("git", args, { reject: false })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        throw new Error((r.stderr || r.stdout || "git worktree remove failed").trim());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function isDirty(path) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("git", ["status", "--porcelain"], {
                        cwd: path,
                        reject: false
                    })];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r.exitCode === 0 && (r.stdout || "").trim().length > 0];
            }
        });
    });
}
function branchExists(branch) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("git", ["show-ref", "--verify", "--quiet", "refs/heads/".concat(branch)], { reject: false })];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r.exitCode === 0];
            }
        });
    });
}
/**
 * Check if creating `branch` would conflict with an existing ref in the
 * hierarchy. Git refs are path-like: `test` and `test/sid` can't coexist
 * because `test` would need to be both a file and a directory under
 * `.git/refs/heads/`.
 *
 * Returns the conflicting ref name, or null if no conflict.
 */
function refConflict(branch) {
    return __awaiter(this, void 0, void 0, function () {
        var parts, i, ancestor, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parts = branch.split("/");
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i < parts.length)) return [3 /*break*/, 4];
                    ancestor = parts.slice(0, i).join("/");
                    return [4 /*yield*/, branchExists(ancestor)];
                case 2:
                    if (_a.sent())
                        return [2 /*return*/, ancestor];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, (0, execa_1.execa)("git", ["for-each-ref", "--format=%(refname:short)", "refs/heads/".concat(branch, "/")], { reject: false })];
                case 5:
                    r = _a.sent();
                    if (r.exitCode === 0 && r.stdout.trim()) {
                        return [2 /*return*/, r.stdout.trim().split("\n")[0]];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function deleteBranch(branch) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("git", ["branch", "-D", branch], { reject: false })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        throw new Error((r.stderr || r.stdout || "git branch -D ".concat(branch, " failed")).trim());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
