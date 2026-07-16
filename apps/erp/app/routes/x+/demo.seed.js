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
exports.config = void 0;
exports.loader = loader;
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var locale_1 = require("@carbon/locale");
var utils_1 = require("@carbon/utils");
var functions_1 = require("@vercel/functions");
var demoSeed_server_1 = require("~/services/demoSeed.server");
/**
 * Seeds the current user's demo company with sample data, and reports progress.
 *
 * The seed runs via `waitUntil` from `@vercel/functions`, which on Vercel keeps
 * the serverless function alive after the response is sent (up to `maxDuration`).
 * On long-running Node servers (foxhole, self-hosted) `waitUntil` is a no-op
 * that falls back to background execution, matching the prior `void` behaviour.
 *
 * `maxDuration: 300` tells Vercel to allow up to 5 minutes for this route's
 * function — enough headroom for the ~3-minute seed.
 *
 * GET  → { status, counts } for the progress toast to poll.
 * POST → atomically claims a `pending` demo and kicks off the detached seed.
 */
// Vercel route config: isolate this route into its own server bundle with a
// 5-minute execution limit so the background seed isn't cut off by the default
// 60-second serverless timeout.
exports.config = { maxDuration: 300 };
function getProgressCounts(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var count, counts, items, total;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = function (table) { return __awaiter(_this, void 0, void 0, function () {
                        var n;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client
                                        .from(table)
                                        .select("id", { count: "exact", head: true })
                                        .eq("companyId", companyId)];
                                case 1:
                                    n = (_a.sent()).count;
                                    return [2 /*return*/, n !== null && n !== void 0 ? n : 0];
                            }
                        });
                    }); };
                    return [4 /*yield*/, Promise.all([
                            count("item"),
                            count("customer"),
                            count("supplier"),
                            count("salesOrder"),
                            count("job"),
                            count("jobOperation"),
                            count("productionEvent"),
                            count("nonConformance"),
                            count("gauge"),
                            count("procedure"),
                            count("quote"),
                            count("purchaseOrder"),
                            count("maintenanceSchedule"),
                            count("riskRegister"),
                            count("training")
                        ])];
                case 1:
                    counts = _a.sent();
                    items = counts[0];
                    total = counts.reduce(function (sum, n) { return sum + n; }, 0);
                    return [2 /*return*/, { items: items, total: total }];
            }
        });
    });
}
// A seed that has been "seeding" for longer than this is assumed to have been
// killed by the runtime (e.g. Vercel cold-killing a timed-out function before
// waitUntil / maxDuration was in place). The loader auto-repairs so the
// progress toast doesn't loop forever.
var SEED_STALE_MS = 15 * 60 * 1000; // 15 minutes
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, demoRow, age, admin, itemCount, repairedStatus;
        var _d, _e;
        var _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, client
                            .from("demoCompany")
                            .select("id, seedStatus, updatedAt")
                            .eq("id", companyId)
                            .maybeSingle()];
                case 2:
                    demoRow = (_g.sent()).data;
                    if (!demoRow) {
                        return [2 /*return*/, { status: "none", counts: null }];
                    }
                    if (!(demoRow.seedStatus === "seeding")) return [3 /*break*/, 6];
                    age = Date.now() - new Date(demoRow.updatedAt).getTime();
                    if (!(age > SEED_STALE_MS)) return [3 /*break*/, 6];
                    admin = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, admin
                            .from("item")
                            .select("id", { count: "exact", head: true })
                            .eq("companyId", companyId)];
                case 3:
                    itemCount = (_g.sent()).count;
                    repairedStatus = (itemCount !== null && itemCount !== void 0 ? itemCount : 0) > 0 ? "seeded" : "pending";
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .update({ seedStatus: repairedStatus })
                            .eq("id", companyId)];
                case 4:
                    _g.sent();
                    _d = {
                        status: repairedStatus
                    };
                    return [4 /*yield*/, getProgressCounts(client, companyId)];
                case 5: return [2 /*return*/, (_d.counts = _g.sent(),
                        _d)];
                case 6:
                    _e = {
                        status: ((_f = demoRow.seedStatus) !== null && _f !== void 0 ? _f : "pending")
                    };
                    return [4 /*yield*/, getProgressCounts(client, companyId)];
                case 7: return [2 /*return*/, (_e.counts = _g.sent(),
                        _e)];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, admin, links, companyIds, demo, itemCount, claimed, location, language;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    userId = (_c.sent()).userId;
                    admin = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, admin
                            .from("userToCompany")
                            .select("companyId")
                            .eq("userId", userId)];
                case 2:
                    links = (_c.sent()).data;
                    companyIds = (links !== null && links !== void 0 ? links : []).map(function (l) { return l.companyId; });
                    if (!companyIds.length)
                        return [2 /*return*/, { status: "none" }];
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .select("id, seedStatus")
                            .in("id", companyIds)
                            .maybeSingle()];
                case 3:
                    demo = (_c.sent()).data;
                    if (!demo)
                        return [2 /*return*/, { status: "none" }];
                    return [4 /*yield*/, admin
                            .from("item")
                            .select("id", { count: "exact", head: true })
                            .eq("companyId", demo.id)];
                case 4:
                    itemCount = (_c.sent()).count;
                    if (!((itemCount !== null && itemCount !== void 0 ? itemCount : 0) > 0)) return [3 /*break*/, 7];
                    if (!(demo.seedStatus !== "seeded")) return [3 /*break*/, 6];
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .update({ seedStatus: "seeded" })
                            .eq("id", demo.id)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [2 /*return*/, { status: "seeded" }];
                case 7: return [4 /*yield*/, admin
                        .from("demoCompany")
                        .update({ seedStatus: "seeding" })
                        .eq("id", demo.id)
                        .neq("seedStatus", "seeding")
                        .select("id")
                        .maybeSingle()];
                case 8:
                    claimed = (_c.sent()).data;
                    if (!claimed) {
                        return [2 /*return*/, { status: "seeding" }];
                    }
                    return [4 /*yield*/, admin
                            .from("location")
                            .select("id")
                            .eq("companyId", demo.id)
                            .eq("name", "Headquarters")
                            .maybeSingle()];
                case 9:
                    location = (_c.sent()).data;
                    if (!!(location === null || location === void 0 ? void 0 : location.id)) return [3 /*break*/, 11];
                    return [4 /*yield*/, admin
                            .from("demoCompany")
                            .update({ seedStatus: "failed" })
                            .eq("id", demo.id)];
                case 10:
                    _c.sent();
                    return [2 /*return*/, { status: "failed" }];
                case 11:
                    language = (0, locale_1.resolveLanguage)((0, utils_1.getPreferenceHeaders)(request).locale);
                    // waitUntil: on Vercel keeps the serverless function alive after the response;
                    // on long-running Node servers behaves like `void` (background execution).
                    (0, functions_1.waitUntil)((0, demoSeed_server_1.runDemoSeed)({
                        companyId: demo.id,
                        userId: userId,
                        locationId: location.id,
                        language: language
                    }));
                    return [2 /*return*/, { status: "seeding" }];
            }
        });
    });
}
