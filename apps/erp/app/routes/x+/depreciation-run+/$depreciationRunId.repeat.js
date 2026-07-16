"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var accounting_1 = require("~/modules/accounting");
var accounting_utils_1 = require("~/modules/accounting/accounting.utils");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, depreciationRunId, _d, _e, sourceRun, _f, _g, _h, _j, periodEnd, runsForPeriod, runIdsForPeriod, coveredAssetIds, existingLines, companySettings, taxEnabled, assets, _k, _l, uncoveredAssets, _m, _o, lastPostedRun, lastPostedPeriodEnd, usageLogs, usageMap, lines, _p, _q, result, _r, _s, _t, _u;
        var _v, _w, _x, _y, _z, _0;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "accounting"
                        })];
                case 1:
                    _c = _1.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    depreciationRunId = params.depreciationRunId;
                    if (!!depreciationRunId) return [3 /*break*/, 3];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Missing depreciation run ID"))];
                case 2: throw _d.apply(void 0, _e.concat([_1.sent()]));
                case 3: return [4 /*yield*/, client
                        .from("depreciationRun")
                        .select("periodEnd, status")
                        .eq("id", depreciationRunId)
                        .single()];
                case 4:
                    sourceRun = _1.sent();
                    if (!sourceRun.error) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(sourceRun.error, "Failed to load source run"))];
                case 5: throw _f.apply(void 0, _g.concat([_1.sent()]));
                case 6:
                    if (!(sourceRun.data.status !== "Posted")) return [3 /*break*/, 8];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Only posted runs can be repeated"))];
                case 7: throw _h.apply(void 0, _j.concat([_1.sent()]));
                case 8:
                    periodEnd = sourceRun.data.periodEnd;
                    return [4 /*yield*/, client
                            .from("depreciationRun")
                            .select("id")
                            .eq("companyId", companyId)
                            .eq("periodEnd", periodEnd)];
                case 9:
                    runsForPeriod = _1.sent();
                    runIdsForPeriod = ((_v = runsForPeriod.data) !== null && _v !== void 0 ? _v : []).map(function (r) { return r.id; });
                    coveredAssetIds = new Set();
                    if (!(runIdsForPeriod.length > 0)) return [3 /*break*/, 11];
                    return [4 /*yield*/, client
                            .from("depreciationRunLine")
                            .select("fixedAssetId")
                            .in("depreciationRunId", runIdsForPeriod)];
                case 10:
                    existingLines = _1.sent();
                    coveredAssetIds = new Set(((_w = existingLines.data) !== null && _w !== void 0 ? _w : []).map(function (l) { return l.fixedAssetId; }));
                    _1.label = 11;
                case 11: return [4 /*yield*/, client
                        .from("companySettings")
                        .select("assetTaxDepreciationEnabled")
                        .eq("id", companyId)
                        .single()];
                case 12:
                    companySettings = _1.sent();
                    taxEnabled = (_y = (_x = companySettings.data) === null || _x === void 0 ? void 0 : _x.assetTaxDepreciationEnabled) !== null && _y !== void 0 ? _y : false;
                    return [4 /*yield*/, client
                            .from("fixedAsset")
                            .select("*")
                            .eq("companyId", companyId)
                            .eq("status", "Active")];
                case 13:
                    assets = _1.sent();
                    if (!assets.error) return [3 /*break*/, 15];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(assets.error, "Failed to fetch assets"))];
                case 14: throw _k.apply(void 0, _l.concat([_1.sent()]));
                case 15:
                    uncoveredAssets = ((_z = assets.data) !== null && _z !== void 0 ? _z : []).filter(function (a) { return !coveredAssetIds.has(a.id); });
                    if (!(uncoveredAssets.length === 0)) return [3 /*break*/, 17];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "All active assets are already covered for this period"))];
                case 16: throw _m.apply(void 0, _o.concat([_1.sent()]));
                case 17: return [4 /*yield*/, client
                        .from("depreciationRun")
                        .select("periodEnd")
                        .eq("companyId", companyId)
                        .eq("status", "Posted")
                        .lt("periodEnd", periodEnd)
                        .order("periodEnd", { ascending: false })
                        .limit(1)];
                case 18:
                    lastPostedRun = _1.sent();
                    lastPostedPeriodEnd = lastPostedRun.data && lastPostedRun.data.length > 0
                        ? lastPostedRun.data[0].periodEnd
                        : null;
                    return [4 /*yield*/, client
                            .from("fixedAssetUsageLog")
                            .select("fixedAssetId, unitsProduced")
                            .eq("periodEnd", periodEnd)];
                case 19:
                    usageLogs = _1.sent();
                    usageMap = new Map(((_0 = usageLogs.data) !== null && _0 !== void 0 ? _0 : []).map(function (u) { return [u.fixedAssetId, u]; }));
                    lines = (0, accounting_utils_1.buildDepreciationLines)(uncoveredAssets.map(function (a) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        return (__assign(__assign({}, a), { accumulatedTaxDepreciation: Number((_a = a.accumulatedTaxDepreciation) !== null && _a !== void 0 ? _a : 0), taxDepreciationMethod: (_b = a.taxDepreciationMethod) !== null && _b !== void 0 ? _b : null, taxUsefulLifeMonths: (_c = a.taxUsefulLifeMonths) !== null && _c !== void 0 ? _c : null, taxResidualValuePercent: (_d = a.taxResidualValuePercent) !== null && _d !== void 0 ? _d : null, macrsPropertyClass: (_e = a.macrsPropertyClass) !== null && _e !== void 0 ? _e : null, macrsConvention: (_f = a.macrsConvention) !== null && _f !== void 0 ? _f : null, bonusDepreciationPercent: (_g = a.bonusDepreciationPercent) !== null && _g !== void 0 ? _g : null }));
                    }), periodEnd, lastPostedPeriodEnd, taxEnabled, usageMap);
                    if (!(lines.length === 0)) return [3 /*break*/, 21];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "No depreciation to calculate for uncovered assets"))];
                case 20: throw _p.apply(void 0, _q.concat([_1.sent()]));
                case 21: return [4 /*yield*/, (0, accounting_1.insertDepreciationRun)(client, {
                        periodEnd: periodEnd,
                        lines: lines,
                        companyId: companyId,
                        createdBy: userId
                    })];
                case 22:
                    result = _1.sent();
                    if (!(result.error || !result.data)) return [3 /*break*/, 24];
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to create repeat depreciation run"))];
                case 23: throw _r.apply(void 0, _s.concat([_1.sent()]));
                case 24:
                    _t = react_router_1.redirect;
                    _u = [path_1.path.to.depreciationRun(result.data.id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Repeat depreciation run created"))];
                case 25: throw _t.apply(void 0, _u.concat([_1.sent()]));
            }
        });
    });
}
