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
exports.pickBorrowSlug = pickBorrowSlug;
exports.pickApps = pickApps;
exports.promptBranch = promptBranch;
exports.promptDirName = promptDirName;
exports.promptBaseRef = promptBaseRef;
exports.promptCopyEnv = promptCopyEnv;
exports.confirmReset = confirmReset;
exports.confirmRemove = confirmRemove;
var node_fs_1 = require("node:fs");
var prompts_1 = require("@clack/prompts");
var pathe_1 = require("pathe");
var picocolors_1 = require("picocolors");
var constants_js_1 = require("./constants.js");
var git_js_1 = require("./git.js");
var worktree_js_1 = require("./worktree.js");
// git-check-ref-format(1) rules.
var INVALID_BRANCH_RE = /(^[/-])|([/-]$)|(\.\.)|(@\{)|([\s~^:?*[\\])|(\/{2,})/;
function pickBorrowSlug(currentSlug) {
    return __awaiter(this, void 0, void 0, function () {
        var registry, others, picked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    registry = (0, worktree_js_1.listSlugs)();
                    others = Object.entries(registry).filter(function (_a) {
                        var s = _a[0];
                        return s !== currentSlug;
                    });
                    if (others.length === 0) {
                        throw new Error("No other worktree stacks in ~/.carbon/dev-ports.json.\nRun `crbn up` in another worktree first.");
                    }
                    if (others.length === 1) {
                        prompts_1.log.info("auto-selecting only available worktree: ".concat(others[0][0]));
                        return [2 /*return*/, others[0][0]];
                    }
                    return [4 /*yield*/, (0, prompts_1.select)({
                            message: "Borrow containers from which worktree?",
                            options: others.map(function (_a) {
                                var s = _a[0], entry = _a[1];
                                return ({
                                    value: s,
                                    label: s,
                                    hint: entry.worktreeRoot
                                });
                            })
                        })];
                case 1:
                    picked = _a.sent();
                    if ((0, prompts_1.isCancel)(picked))
                        abort();
                    return [2 /*return*/, picked];
            }
        });
    });
}
function pickApps() {
    return __awaiter(this, void 0, void 0, function () {
        var fromEnv, picked;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fromEnv = process.env.CARBON_DEV_APPS;
                    if (fromEnv) {
                        return [2 /*return*/, fromEnv
                                .split(",")
                                .map(function (s) { return s.trim(); })
                                .filter(function (s) { return constants_js_1.APP_CHOICES.some(function (c) { return c.value === s; }); })];
                    }
                    if (!process.stdin.isTTY)
                        return [2 /*return*/, constants_js_1.APP_CHOICES.map(function (c) { return c.value; })];
                    (0, prompts_1.note)("When no apps are selected it will only run (postgres, kong, supabase, inngest, mail) without spawning ERP/MES dev servers.", "Tip");
                    return [4 /*yield*/, (0, prompts_1.multiselect)({
                            message: "Which apps to run?",
                            options: constants_js_1.APP_CHOICES.map(function (c) { return ({
                                value: c.value,
                                label: c.label,
                                hint: c.hint
                            }); }),
                            initialValues: constants_js_1.APP_CHOICES.map(function (c) { return c.value; }),
                            required: false
                        })];
                case 1:
                    picked = _a.sent();
                    if ((0, prompts_1.isCancel)(picked))
                        abort();
                    return [2 /*return*/, picked];
            }
        });
    });
}
function promptBranch(initial) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function () {
                        var value, trimmed, conflict, worktrees, onWorktree, recreate, err_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, (0, prompts_1.text)({
                                        message: "Branch name",
                                        placeholder: "feature/foo",
                                        initialValue: initial,
                                        validate: function (v) {
                                            if (!v || !v.trim())
                                                return "Branch is required";
                                            var t = v.trim();
                                            if (INVALID_BRANCH_RE.test(t))
                                                return "Invalid git branch name (no spaces, control chars, ~^:?*[\\, no leading/trailing - or /, no '..' or '@{')";
                                            if (t.length > 100)
                                                return "Branch name too long";
                                        }
                                    })];
                                case 1:
                                    value = _b.sent();
                                    if ((0, prompts_1.isCancel)(value))
                                        abort();
                                    trimmed = value.trim();
                                    return [4 /*yield*/, (0, git_js_1.refConflict)(trimmed)];
                                case 2:
                                    conflict = _b.sent();
                                    if (conflict) {
                                        prompts_1.log.error("Branch '".concat(trimmed, "' conflicts with existing ref '").concat(conflict, "'.\n") +
                                            "  Git can't have both \u2014 pick a different name or delete '".concat(conflict, "' first."));
                                        initial = undefined;
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, (0, git_js_1.branchExists)(trimmed)];
                                case 3:
                                    if (!_b.sent()) return [3 /*break*/, 10];
                                    return [4 /*yield*/, (0, git_js_1.listWorktrees)()];
                                case 4:
                                    worktrees = _b.sent();
                                    onWorktree = worktrees.find(function (w) { return w.branch === trimmed; });
                                    if (onWorktree) {
                                        prompts_1.log.error("Branch '".concat(trimmed, "' already has a worktree at ").concat(picocolors_1.default.dim(onWorktree.path), "\n") +
                                            "  Jump in with:  ".concat(picocolors_1.default.cyan("crbn go ".concat(trimmed))));
                                        return [2 /*return*/, "continue"];
                                    }
                                    // Branch without worktree → offer in-flow nuke + recreate.
                                    prompts_1.log.warn("Branch '".concat(trimmed, "' exists locally but has no worktree.\n") +
                                        "  Materialize the existing branch with:  ".concat(picocolors_1.default.cyan("crbn checkout ".concat(trimmed))));
                                    return [4 /*yield*/, (0, prompts_1.confirm)({
                                            message: "Delete '".concat(trimmed, "' (force) and create fresh branch?"),
                                            initialValue: false
                                        })];
                                case 5:
                                    recreate = _b.sent();
                                    if ((0, prompts_1.isCancel)(recreate))
                                        abort();
                                    if (!recreate)
                                        return [2 /*return*/, "continue"];
                                    _b.label = 6;
                                case 6:
                                    _b.trys.push([6, 8, , 9]);
                                    return [4 /*yield*/, (0, git_js_1.deleteBranch)(trimmed)];
                                case 7:
                                    _b.sent();
                                    return [3 /*break*/, 9];
                                case 8:
                                    err_1 = _b.sent();
                                    prompts_1.log.error("Failed to delete branch: ".concat(err_1.message));
                                    return [2 /*return*/, "continue"];
                                case 9:
                                    prompts_1.log.success("Deleted branch '".concat(trimmed, "'"));
                                    _b.label = 10;
                                case 10: return [2 /*return*/, { value: trimmed }];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function promptDirName(parentDir, initial) {
    return __awaiter(this, void 0, void 0, function () {
        var value, trimmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, prompts_1.text)({
                            message: "Worktree directory (relative to ".concat(picocolors_1.default.dim(parentDir), ")"),
                            initialValue: initial,
                            validate: function (v) {
                                if (!v || !v.trim())
                                    return "Directory name required";
                                if (/[\s/]/.test(v.trim()))
                                    return "No spaces or slashes — must be a single dirname";
                            }
                        })];
                case 1:
                    value = _a.sent();
                    if ((0, prompts_1.isCancel)(value))
                        abort();
                    trimmed = value.trim();
                    if ((0, node_fs_1.existsSync)((0, pathe_1.join)(parentDir, trimmed))) {
                        prompts_1.log.error("Path '".concat(trimmed, "' already exists in ").concat(parentDir));
                        return [3 /*break*/, 0];
                    }
                    return [2 /*return*/, trimmed];
                case 2: return [2 /*return*/];
            }
        });
    });
}
function promptBaseRef(currentBranch) {
    return __awaiter(this, void 0, void 0, function () {
        var opts, baseRef;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = [
                        { value: "main", label: "main" }
                    ];
                    if (currentBranch && currentBranch !== "main") {
                        opts.push({ value: currentBranch, label: currentBranch });
                    }
                    opts.push({ value: "origin/main", label: "origin/main" });
                    return [4 /*yield*/, (0, prompts_1.select)({
                            message: "Base ref",
                            options: opts,
                            initialValue: "main"
                        })];
                case 1:
                    baseRef = _a.sent();
                    if ((0, prompts_1.isCancel)(baseRef))
                        abort();
                    return [2 /*return*/, baseRef];
            }
        });
    });
}
function promptCopyEnv() {
    return __awaiter(this, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.confirm)({
                        message: "Copy .env from current worktree?",
                        initialValue: true
                    })];
                case 1:
                    ok = _a.sent();
                    if ((0, prompts_1.isCancel)(ok))
                        abort();
                    return [2 /*return*/, ok];
            }
        });
    });
}
function confirmReset(projectName) {
    return __awaiter(this, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.env.CARBON_DEV_YES === "1")
                        return [2 /*return*/, true];
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: "Destroy all volumes for ".concat(picocolors_1.default.bold(projectName), "? (postgres, storage, inngest data will be wiped, redis db flushed)"),
                            initialValue: false
                        })];
                case 1:
                    ok = _a.sent();
                    if ((0, prompts_1.isCancel)(ok))
                        return [2 /*return*/, false];
                    return [2 /*return*/, ok];
            }
        });
    });
}
function confirmRemove(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.confirm)({
                        message: "Permanently remove ".concat(opts.branchOrPath, " and ").concat(opts.hasStack ? "wipe its docker volumes" : "the worktree", "?"),
                        initialValue: false
                    })];
                case 1:
                    ok = _a.sent();
                    if ((0, prompts_1.isCancel)(ok))
                        return [2 /*return*/, false];
                    return [2 /*return*/, ok];
            }
        });
    });
}
function abort() {
    (0, prompts_1.cancel)("aborted");
    process.exit(0);
}
