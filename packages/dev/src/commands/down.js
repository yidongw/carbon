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
exports.down = down;
var prompts_1 = require("@clack/prompts");
var picocolors_1 = require("picocolors");
var env_js_1 = require("../env.js");
var git_js_1 = require("../git.js");
var compose_js_1 = require("../services/compose.js");
var portless_js_1 = require("../services/portless.js");
var worktree_js_1 = require("../worktree.js");
// silent: post-SIGINT path. clack tasks/spinner would EIO via setRawMode on
// the freshly-interrupted stdin; fall back to plain printf progress.
function down() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var root, slug, project;
        var _this = this;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, worktree_js_1.getWorktreeRoot)()];
                case 1:
                    root = _a.sent();
                    slug = (0, worktree_js_1.resolveSlug)(root);
                    project = (0, worktree_js_1.projectName)(slug);
                    if (opts.silent) {
                        return [2 /*return*/, runPlain(root, slug, project)];
                    }
                    (0, prompts_1.intro)("Carbon · dev down");
                    return [4 /*yield*/, (0, prompts_1.tasks)([
                            {
                                title: "Stopping ".concat(project, " (volumes preserved)"),
                                task: function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                msg("docker compose stop");
                                                return [4 /*yield*/, (0, compose_js_1.stopStack)(root, slug, false)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, "stack stopped"];
                                        }
                                    });
                                }); }
                            },
                            {
                                title: "Unregister portless aliases",
                                task: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var branch, branchPrefix;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, git_js_1.currentBranch)(root)];
                                            case 1:
                                                branch = _a.sent();
                                                branchPrefix = (0, portless_js_1.branchToPrefix)(branch, slug);
                                                return [4 /*yield*/, (0, portless_js_1.unregisterAliases)(root, branchPrefix)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, "aliases removed"];
                                        }
                                    });
                                }); }
                            },
                            {
                                title: "Clean up portless.json",
                                task: function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        (0, env_js_1.syncAppPortlessConfigs)(root);
                                        return [2 /*return*/, "configs reset"];
                                    });
                                }); }
                            }
                        ])];
                case 2:
                    _a.sent();
                    (0, prompts_1.outro)("stopped");
                    return [2 /*return*/];
            }
        });
    });
}
function runPlain(root, slug, project) {
    return __awaiter(this, void 0, void 0, function () {
        var step, done, branch, branchPrefix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    step = function (msg) {
                        return process.stderr.write("".concat(picocolors_1.default.cyan("•"), " ").concat(msg, "\u2026\n"));
                    };
                    done = function (msg) {
                        return process.stderr.write("".concat(picocolors_1.default.green("✓"), " ").concat(msg, "\n"));
                    };
                    step("stopping ".concat(project, " (volumes preserved)"));
                    return [4 /*yield*/, (0, compose_js_1.stopStack)(root, slug, false)];
                case 1:
                    _a.sent();
                    done("stack stopped");
                    step("unregistering portless aliases");
                    return [4 /*yield*/, (0, git_js_1.currentBranch)(root)];
                case 2:
                    branch = _a.sent();
                    branchPrefix = (0, portless_js_1.branchToPrefix)(branch, slug);
                    return [4 /*yield*/, (0, portless_js_1.unregisterAliases)(root, branchPrefix)];
                case 3:
                    _a.sent();
                    done("aliases removed");
                    step("cleaning up portless.json");
                    (0, env_js_1.syncAppPortlessConfigs)(root);
                    done("configs reset");
                    return [2 /*return*/];
            }
        });
    });
}
