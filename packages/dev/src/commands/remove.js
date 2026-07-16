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
exports.removeWorktreeCmd = removeWorktreeCmd;
var prompts_1 = require("@clack/prompts");
var picocolors_1 = require("picocolors");
var git_js_1 = require("../git.js");
var prompts_js_1 = require("../prompts.js");
var compose_js_1 = require("../services/compose.js");
var portless_js_1 = require("../services/portless.js");
var worktree_js_1 = require("../worktree.js");
function removeWorktreeCmd(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var pruneBranches, wtsAll, mainRoot, wts, choices, selectedPaths, targets, registry, jobs, _i, jobs_1, job, target, dirty, slug, projectLabel, warnings, ok, s, done, total, needsPrune, progress, results, failed, i, label;
        var _this = this;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    pruneBranches = (opts === null || opts === void 0 ? void 0 : opts.prune) === true;
                    (0, prompts_1.intro)("Carbon · remove worktree");
                    return [4 /*yield*/, (0, git_js_1.listWorktrees)()];
                case 1:
                    wtsAll = _f.sent();
                    return [4 /*yield*/, (0, git_js_1.mainCheckoutRoot)()];
                case 2:
                    mainRoot = _f.sent();
                    wts = wtsAll.filter(function (w) { return !w.bare && !w.current && w.path !== mainRoot; });
                    if (wts.length === 0) {
                        prompts_1.log.warn("no other worktrees to remove");
                        (0, prompts_1.outro)("");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, prompts_1.multiselect)({
                            message: "Worktrees to remove",
                            options: wts.map(function (w) {
                                var _a;
                                return ({
                                    value: w.path,
                                    label: "".concat((_a = w.branch) !== null && _a !== void 0 ? _a : "(detached)", "  ").concat(picocolors_1.default.dim(w.path))
                                });
                            }),
                            required: true
                        })];
                case 3:
                    choices = _f.sent();
                    if ((0, prompts_1.isCancel)(choices)) {
                        (0, prompts_1.cancel)("aborted");
                        process.exit(0);
                    }
                    selectedPaths = choices;
                    targets = selectedPaths.map(function (p) { return wts.find(function (w) { return w.path === p; }); });
                    registry = (0, worktree_js_1.listSlugs)();
                    return [4 /*yield*/, Promise.all(targets.map(function (target) { return __awaiter(_this, void 0, void 0, function () {
                            var slug;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        slug = slugForPath(target.path, registry);
                                        _a = {
                                            target: target
                                        };
                                        return [4 /*yield*/, (0, git_js_1.isDirty)(target.path)];
                                    case 1: return [2 /*return*/, (_a.dirty = _b.sent(),
                                            _a.slug = slug,
                                            _a.projectLabel = slug ? (0, worktree_js_1.projectName)(slug) : null,
                                            _a.slotInfo = slug ? (0, worktree_js_1.getSlot)(slug) : null,
                                            _a.branchPrefix = slug ? (0, portless_js_1.branchToPrefix)(target.branch, slug) : null,
                                            _a)];
                                }
                            });
                        }); }))];
                case 4:
                    jobs = _f.sent();
                    _i = 0, jobs_1 = jobs;
                    _f.label = 5;
                case 5:
                    if (!(_i < jobs_1.length)) return [3 /*break*/, 8];
                    job = jobs_1[_i];
                    target = job.target, dirty = job.dirty, slug = job.slug, projectLabel = job.projectLabel;
                    warnings = [];
                    if (dirty)
                        warnings.push("".concat(picocolors_1.default.yellow("⚠"), " uncommitted changes in worktree"));
                    if (slug)
                        warnings.push("".concat(picocolors_1.default.yellow("⚠"), " stack ").concat(projectLabel, " will be destroyed (volumes wiped)"));
                    if (warnings.length)
                        prompts_1.log.warn("".concat((_a = target.branch) !== null && _a !== void 0 ? _a : target.path, "\n").concat(warnings.join("\n")));
                    return [4 /*yield*/, (0, prompts_js_1.confirmRemove)({
                            branchOrPath: (_b = target.branch) !== null && _b !== void 0 ? _b : target.path,
                            hasStack: !!slug
                        })];
                case 6:
                    ok = _f.sent();
                    if (!ok) {
                        (0, prompts_1.cancel)("aborted");
                        process.exit(0);
                    }
                    _f.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    s = (0, prompts_1.spinner)();
                    done = 0;
                    total = jobs.length;
                    needsPrune = jobs.some(function (j) { return j.branchPrefix; });
                    progress = function (label) {
                        s.message("(".concat(done, "/").concat(total, ") ").concat(label));
                    };
                    s.start("Removing ".concat(total, " worktree").concat(total > 1 ? "s" : ""));
                    return [4 /*yield*/, Promise.allSettled(jobs.map(function (job) { return __awaiter(_this, void 0, void 0, function () {
                            var label, target, dirty, slug, projectLabel, slotInfo, branchPrefix;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        label = (_a = job.target.branch) !== null && _a !== void 0 ? _a : job.target.path;
                                        target = job.target, dirty = job.dirty, slug = job.slug, projectLabel = job.projectLabel, slotInfo = job.slotInfo, branchPrefix = job.branchPrefix;
                                        if (!branchPrefix) return [3 /*break*/, 2];
                                        progress("".concat(label, ": unregistering aliases"));
                                        return [4 /*yield*/, (0, portless_js_1.unregisterAliases)(target.path, branchPrefix)];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        if (!(slug && projectLabel)) return [3 /*break*/, 4];
                                        progress("".concat(label, ": tearing down stack"));
                                        return [4 /*yield*/, (0, compose_js_1.destroyProjectVolumes)(target.path, projectLabel)];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4:
                                        if (!(slotInfo && typeof slotInfo.redisDb === "number")) return [3 /*break*/, 6];
                                        progress("".concat(label, ": flushing redis db ").concat(slotInfo.redisDb));
                                        return [4 /*yield*/, (0, compose_js_1.flushDb)(slotInfo.redisDb)];
                                    case 5:
                                        _b.sent();
                                        _b.label = 6;
                                    case 6:
                                        progress("".concat(label, ": removing worktree"));
                                        return [4 /*yield*/, (0, git_js_1.removeWorktree)(target.path, dirty)];
                                    case 7:
                                        _b.sent();
                                        if (!(pruneBranches && target.branch)) return [3 /*break*/, 9];
                                        progress("".concat(label, ": deleting branch"));
                                        return [4 /*yield*/, (0, git_js_1.deleteBranch)(target.branch)];
                                    case 8:
                                        _b.sent();
                                        _b.label = 9;
                                    case 9:
                                        if (slug)
                                            (0, worktree_js_1.removeSlot)(slug);
                                        done++;
                                        progress(picocolors_1.default.green(label));
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 9:
                    results = _f.sent();
                    if (!needsPrune) return [3 /*break*/, 11];
                    s.message("pruning stale routes");
                    return [4 /*yield*/, (0, portless_js_1.pruneStaleRoutes)()];
                case 10:
                    _f.sent();
                    _f.label = 11;
                case 11:
                    s.stop("Removed ".concat(done, "/").concat(total, " worktree").concat(total > 1 ? "s" : ""));
                    failed = results.filter(function (r) { return r.status === "rejected"; });
                    for (i = 0; i < results.length; i++) {
                        if (results[i].status === "rejected") {
                            label = (_c = jobs[i].target.branch) !== null && _c !== void 0 ? _c : jobs[i].target.path;
                            prompts_1.log.error("".concat(label, ": ").concat((_e = (_d = results[i].reason) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : "unknown error"));
                        }
                    }
                    (0, prompts_1.outro)(failed.length ? "done with ".concat(failed.length, " error(s)") : "done");
                    return [2 /*return*/];
            }
        });
    });
}
function slugForPath(path, registry) {
    for (var _i = 0, _a = Object.entries(registry); _i < _a.length; _i++) {
        var _b = _a[_i], slug = _b[0], entry = _b[1];
        if (entry.worktreeRoot === path)
            return slug;
    }
    return null;
}
