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
        var _c, client, companyId, userId, lastRun, lastPeriodEnd, periodEnd, existing, _d, _e, companySettings, taxEnabled, assets, _f, _g, lastPostedRun, lastPostedPeriodEnd, usageLogs, usageMap, lines, result, _h, _j, _k, _l;
        var _m, _o, _p, _q;
        var request = _b.request;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "accounting"
                        })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, client
                            .from("depreciationRun")
                            .select("periodEnd, status")
                            .eq("companyId", companyId)
                            .order("periodEnd", { ascending: false })
                            .limit(1)];
                case 2:
                    lastRun = _r.sent();
                    lastPeriodEnd = lastRun.data && lastRun.data.length > 0 ? lastRun.data[0].periodEnd : null;
                    periodEnd = (0, accounting_utils_1.getNextPeriodEnd)(lastPeriodEnd);
                    return [4 /*yield*/, client
                            .from("depreciationRun")
                            .select("id")
                            .eq("periodEnd", periodEnd)
                            .eq("companyId", companyId)];
                case 3:
                    existing = _r.sent();
                    if (!(existing.data && existing.data.length > 0)) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "A depreciation run already exists for this period"))];
                case 4: throw _d.apply(void 0, _e.concat([_r.sent()]));
                case 5: return [4 /*yield*/, client
                        .from("companySettings")
                        .select("assetTaxDepreciationEnabled")
                        .eq("id", companyId)
                        .single()];
                case 6:
                    companySettings = _r.sent();
                    taxEnabled = (_o = (_m = companySettings.data) === null || _m === void 0 ? void 0 : _m.assetTaxDepreciationEnabled) !== null && _o !== void 0 ? _o : false;
                    return [4 /*yield*/, client
                            .from("fixedAsset")
                            .select("*")
                            .eq("companyId", companyId)
                            .eq("status", "Active")];
                case 7:
                    assets = _r.sent();
                    if (!assets.error) return [3 /*break*/, 9];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(assets.error, "Failed to fetch assets"))];
                case 8: throw _f.apply(void 0, _g.concat([_r.sent()]));
                case 9: return [4 /*yield*/, client
                        .from("depreciationRun")
                        .select("periodEnd")
                        .eq("companyId", companyId)
                        .eq("status", "Posted")
                        .order("periodEnd", { ascending: false })
                        .limit(1)];
                case 10:
                    lastPostedRun = _r.sent();
                    lastPostedPeriodEnd = lastPostedRun.data && lastPostedRun.data.length > 0
                        ? lastPostedRun.data[0].periodEnd
                        : null;
                    return [4 /*yield*/, client
                            .from("fixedAssetUsageLog")
                            .select("fixedAssetId, unitsProduced")
                            .eq("periodEnd", periodEnd)];
                case 11:
                    usageLogs = _r.sent();
                    usageMap = new Map(((_p = usageLogs.data) !== null && _p !== void 0 ? _p : []).map(function (u) { return [u.fixedAssetId, u]; }));
                    lines = (0, accounting_utils_1.buildDepreciationLines)(((_q = assets.data) !== null && _q !== void 0 ? _q : []).map(function (a) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        return (__assign(__assign({}, a), { accumulatedTaxDepreciation: Number((_a = a.accumulatedTaxDepreciation) !== null && _a !== void 0 ? _a : 0), taxDepreciationMethod: (_b = a.taxDepreciationMethod) !== null && _b !== void 0 ? _b : null, taxUsefulLifeMonths: (_c = a.taxUsefulLifeMonths) !== null && _c !== void 0 ? _c : null, taxResidualValuePercent: (_d = a.taxResidualValuePercent) !== null && _d !== void 0 ? _d : null, macrsPropertyClass: (_e = a.macrsPropertyClass) !== null && _e !== void 0 ? _e : null, macrsConvention: (_f = a.macrsConvention) !== null && _f !== void 0 ? _f : null, bonusDepreciationPercent: (_g = a.bonusDepreciationPercent) !== null && _g !== void 0 ? _g : null }));
                    }), periodEnd, lastPostedPeriodEnd, taxEnabled, usageMap);
                    return [4 /*yield*/, (0, accounting_1.insertDepreciationRun)(client, {
                            periodEnd: periodEnd,
                            lines: lines,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 12:
                    result = _r.sent();
                    if (!(result.error || !result.data)) return [3 /*break*/, 14];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to create depreciation run"))];
                case 13: throw _h.apply(void 0, _j.concat([_r.sent()]));
                case 14:
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.depreciationRun(result.data.id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Depreciation run created"))];
                case 15: throw _k.apply(void 0, _l.concat([_r.sent()]));
            }
        });
    });
}
