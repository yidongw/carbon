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
var octokit_1 = require("octokit");
var OWNER = requireEnv("OWNER");
var REPO = requireEnv("REPO");
var PR_NUMBER = Number(requireEnv("PR_NUMBER"));
var PR_AUTHOR = requireEnv("PR_AUTHOR");
var GITHUB_TOKEN = requireEnv("GITHUB_TOKEN");
var COMPLEXITY_LABELS = [
    {
        name: "complexity: low",
        color: "0e8a16",
        description: "Low-complexity PR",
    },
    {
        name: "complexity: medium",
        color: "fbca04",
        description: "Medium-complexity PR",
    },
    {
        name: "complexity: high",
        color: "e4691a",
        description: "High-complexity PR",
    },
    {
        name: "complexity: critical",
        color: "b60205",
        description: "Critical-complexity PR",
    },
];
var FILE_SCORE_WEIGHT = 2;
var FILE_SCORE_CAP = 30;
var LINE_SCORE_BUCKET_SIZE = 50;
var LINE_SCORE_WEIGHT = 3;
var LINE_SCORE_BUCKET_CAP = 20;
var EXPERIENCE_DISCOUNT_CAP = 20;
var TEST_COVERAGE_BONUS = 10;
var octokit = new octokit_1.Octokit({ auth: GITHUB_TOKEN });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var files, fileCount, linesChanged, hasTests, authorMergedPRCount, fileScore, lineScore, experienceDiscount, testBonus, score, label;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!Number.isInteger(PR_NUMBER) || PR_NUMBER < 1) {
                        throw new Error("PR_NUMBER must be a positive integer");
                    }
                    return [4 /*yield*/, listPullFiles()];
                case 1:
                    files = _a.sent();
                    fileCount = files.length;
                    linesChanged = files.reduce(function (sum, file) { return sum + file.changes; }, 0);
                    hasTests = files.some(function (file) { return isTestFile(file.filename); });
                    return [4 /*yield*/, getAuthorMergedPRCount()];
                case 2:
                    authorMergedPRCount = _a.sent();
                    fileScore = Math.min(fileCount, FILE_SCORE_CAP) * FILE_SCORE_WEIGHT;
                    lineScore = Math.min(Math.floor(linesChanged / LINE_SCORE_BUCKET_SIZE), LINE_SCORE_BUCKET_CAP) * LINE_SCORE_WEIGHT;
                    experienceDiscount = Math.min(authorMergedPRCount, EXPERIENCE_DISCOUNT_CAP);
                    testBonus = hasTests ? TEST_COVERAGE_BONUS : 0;
                    score = fileScore + lineScore - experienceDiscount - testBonus;
                    label = labelForScore(score);
                    return [4 /*yield*/, ensureComplexityLabels()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, replaceComplexityLabel(label.name)];
                case 4:
                    _a.sent();
                    console.log("Applied ".concat(label.name, " to #").concat(PR_NUMBER, " (score: ").concat(score, ")"));
                    console.log("  files: ".concat(fileCount, " (+").concat(fileScore, "), lines: ").concat(linesChanged, " (+").concat(lineScore, ")"));
                    console.log("  experience: ".concat(authorMergedPRCount, " (-").concat(experienceDiscount, "), tests: ").concat(hasTests, " (-").concat(testBonus, ")"));
                    return [2 /*return*/];
            }
        });
    });
}
function listPullFiles() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, octokit.paginate(octokit.rest.pulls.listFiles, {
                    owner: OWNER,
                    repo: REPO,
                    pull_number: PR_NUMBER,
                    per_page: 100,
                })];
        });
    });
}
function getAuthorMergedPRCount() {
    return __awaiter(this, void 0, void 0, function () {
        var query, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "repo:".concat(OWNER, "/").concat(REPO, " is:pr is:merged author:").concat(PR_AUTHOR);
                    return [4 /*yield*/, octokit.rest.search.issuesAndPullRequests({
                            q: query,
                            per_page: 1,
                        })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data.total_count];
            }
        });
    });
}
function ensureComplexityLabels() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(COMPLEXITY_LABELS.map(function (l) { return ensureLabel(l.name, l.color, l.description); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ensureLabel(name, color, description) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, octokit.rest.issues.createLabel({
                            owner: OWNER,
                            repo: REPO,
                            name: name,
                            color: color,
                            description: description,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    error_1 = _a.sent();
                    if (!isOctokitError(error_1, 422)) return [3 /*break*/, 4];
                    return [4 /*yield*/, octokit.rest.issues.updateLabel({
                            owner: OWNER,
                            repo: REPO,
                            name: name,
                            color: color,
                            description: description,
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    if (isOctokitError(error_1, 403)) {
                        return [2 /*return*/];
                    }
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function replaceComplexityLabel(nextLabel) {
    return __awaiter(this, void 0, void 0, function () {
        var issue, labels;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.rest.issues.get({
                        owner: OWNER,
                        repo: REPO,
                        issue_number: PR_NUMBER,
                    })];
                case 1:
                    issue = (_a.sent()).data;
                    labels = issue.labels
                        .map(function (label) { return (typeof label === "string" ? label : label.name); })
                        .filter(function (name) { return Boolean(name); });
                    return [4 /*yield*/, Promise.all(labels
                            .filter(function (label) { return label.startsWith("complexity:") && label !== nextLabel; })
                            .map(function (label) { return removeLabelIfPresent(label); }))];
                case 2:
                    _a.sent();
                    if (!!labels.includes(nextLabel)) return [3 /*break*/, 4];
                    return [4 /*yield*/, octokit.rest.issues.addLabels({
                            owner: OWNER,
                            repo: REPO,
                            issue_number: PR_NUMBER,
                            labels: [nextLabel],
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function removeLabelIfPresent(label) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, octokit.rest.issues.removeLabel({
                            owner: OWNER,
                            repo: REPO,
                            issue_number: PR_NUMBER,
                            name: label,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    if (!isOctokitError(error_2, 404)) {
                        throw error_2;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function labelForScore(score) {
    if (score < 15)
        return COMPLEXITY_LABELS[0];
    if (score < 35)
        return COMPLEXITY_LABELS[1];
    if (score < 60)
        return COMPLEXITY_LABELS[2];
    return COMPLEXITY_LABELS[3];
}
function isTestFile(filename) {
    return (/(^|\/)(test|tests|__tests__)\//.test(filename) ||
        /\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filename));
}
function requireEnv(name) {
    var value = process.env[name];
    if (!value) {
        throw new Error("".concat(name, " is required"));
    }
    return value;
}
function isOctokitError(error, status) {
    return (typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === status);
}
main().catch(function (error) {
    console.error(error);
    process.exit(1);
});
