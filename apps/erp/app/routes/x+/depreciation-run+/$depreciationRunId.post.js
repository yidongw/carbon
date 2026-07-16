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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var accounting_1 = require("~/modules/accounting");
var accounting_server_1 = require("~/modules/accounting/accounting.server");
var database_server_1 = require("~/services/database.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, depreciationRunId, _d, _e, run, _f, _g, _h, companySettingsResult, accountDefaultsResult, taxEnabled, taxRate, dtlAccountId, dtExpenseAccountId, _j, linesResult, dimensionsResult, _k, _l, locationDimensionId, assetClassDimensionId, postingDate, accountingPeriod, _m, _o, _i, _p, line, asset, assetClass, _q, _r, lines, err_1, _s, _t, _u, _v;
        var _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_6) {
            switch (_6.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "accounting"
                        })];
                case 1:
                    _c = _6.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    depreciationRunId = params.depreciationRunId;
                    if (!!depreciationRunId) return [3 /*break*/, 3];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Missing depreciation run ID"))];
                case 2: throw _d.apply(void 0, _e.concat([_6.sent()]));
                case 3: return [4 /*yield*/, client
                        .from("depreciationRun")
                        .select("*")
                        .eq("id", depreciationRunId)
                        .eq("companyId", companyId)
                        .single()];
                case 4:
                    run = _6.sent();
                    if (!(run.error || run.data.status !== "Draft")) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(run.error, "Run is not in Draft status"))];
                case 5: throw _f.apply(void 0, _g.concat([_6.sent()]));
                case 6: return [4 /*yield*/, Promise.all([
                        client
                            .from("companySettings")
                            .select("assetTaxDepreciationEnabled, assetTaxRate")
                            .eq("id", companyId)
                            .single(),
                        client
                            .from("accountDefault")
                            .select("deferredTaxLiabilityAccountId, deferredTaxExpenseAccountId")
                            .eq("companyId", companyId)
                            .single()
                    ])];
                case 7:
                    _h = _6.sent(), companySettingsResult = _h[0], accountDefaultsResult = _h[1];
                    taxEnabled = (_x = (_w = companySettingsResult.data) === null || _w === void 0 ? void 0 : _w.assetTaxDepreciationEnabled) !== null && _x !== void 0 ? _x : false;
                    taxRate = ((_y = companySettingsResult.data) === null || _y === void 0 ? void 0 : _y.assetTaxRate)
                        ? Number(companySettingsResult.data.assetTaxRate)
                        : null;
                    dtlAccountId = (_z = accountDefaultsResult.data) === null || _z === void 0 ? void 0 : _z.deferredTaxLiabilityAccountId;
                    dtExpenseAccountId = (_0 = accountDefaultsResult.data) === null || _0 === void 0 ? void 0 : _0.deferredTaxExpenseAccountId;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("depreciationRunLine")
                                .select("id, fixedAssetId, amount, taxAmount, fixedAsset:fixedAssetId(id, fixedAssetId, locationId, fixedAssetClassId, acquisitionCost, accumulatedDepreciation, accumulatedTaxDepreciation, residualValuePercent, usefulLifeMonths, fixedAssetClass:fixedAssetClassId(depreciationExpenseAccountId, accumulatedDepreciationAccountId))")
                                .eq("depreciationRunId", depreciationRunId),
                            client
                                .from("dimension")
                                .select("id, entityType")
                                .eq("companyGroupId", companyGroupId)
                                .eq("active", true)
                        ])];
                case 8:
                    _j = _6.sent(), linesResult = _j[0], dimensionsResult = _j[1];
                    if (!linesResult.error) return [3 /*break*/, 10];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(linesResult.error, "Failed to fetch run lines"))];
                case 9: throw _k.apply(void 0, _l.concat([_6.sent()]));
                case 10:
                    locationDimensionId = (_2 = ((_1 = dimensionsResult.data) !== null && _1 !== void 0 ? _1 : []).find(function (d) { return d.entityType === "Location"; })) === null || _2 === void 0 ? void 0 : _2.id;
                    assetClassDimensionId = (_4 = ((_3 = dimensionsResult.data) !== null && _3 !== void 0 ? _3 : []).find(function (d) { return d.entityType === "FixedAssetClass"; })) === null || _4 === void 0 ? void 0 : _4.id;
                    postingDate = run.data.periodEnd;
                    return [4 /*yield*/, (0, accounting_1.getOrCreateAccountingPeriod)(client, companyId, postingDate)];
                case 11:
                    accountingPeriod = _6.sent();
                    if (!accountingPeriod.error) return [3 /*break*/, 13];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(accountingPeriod.error, "Failed to get accounting period"))];
                case 12: throw _m.apply(void 0, _o.concat([_6.sent()]));
                case 13:
                    _i = 0, _p = linesResult.data;
                    _6.label = 14;
                case 14:
                    if (!(_i < _p.length)) return [3 /*break*/, 17];
                    line = _p[_i];
                    asset = line.fixedAsset;
                    assetClass = asset === null || asset === void 0 ? void 0 : asset.fixedAssetClass;
                    if (!(!(assetClass === null || assetClass === void 0 ? void 0 : assetClass.depreciationExpenseAccountId) ||
                        !(assetClass === null || assetClass === void 0 ? void 0 : assetClass.accumulatedDepreciationAccountId))) return [3 /*break*/, 16];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Asset ".concat((_5 = asset === null || asset === void 0 ? void 0 : asset.fixedAssetId) !== null && _5 !== void 0 ? _5 : line.fixedAssetId, " is missing depreciation account configuration")))];
                case 15: throw _q.apply(void 0, _r.concat([_6.sent()]));
                case 16:
                    _i++;
                    return [3 /*break*/, 14];
                case 17:
                    lines = linesResult.data.map(function (line) {
                        var _a, _b;
                        var asset = line.fixedAsset;
                        var assetClass = asset.fixedAssetClass;
                        return {
                            id: line.id,
                            fixedAssetId: line.fixedAssetId,
                            amount: Number(line.amount),
                            taxAmount: Number((_a = line.taxAmount) !== null && _a !== void 0 ? _a : 0),
                            asset: {
                                fixedAssetId: asset.fixedAssetId,
                                locationId: asset.locationId,
                                fixedAssetClassId: asset.fixedAssetClassId,
                                acquisitionCost: Number(asset.acquisitionCost),
                                accumulatedDepreciation: Number(asset.accumulatedDepreciation),
                                accumulatedTaxDepreciation: Number((_b = asset.accumulatedTaxDepreciation) !== null && _b !== void 0 ? _b : 0),
                                residualValuePercent: Number(asset.residualValuePercent),
                                depreciationExpenseAccountId: assetClass.depreciationExpenseAccountId,
                                accumulatedDepreciationAccountId: assetClass.accumulatedDepreciationAccountId
                            }
                        };
                    });
                    _6.label = 18;
                case 18:
                    _6.trys.push([18, 20, , 22]);
                    return [4 /*yield*/, (0, accounting_server_1.postDepreciationRun)((0, database_server_1.getDatabaseClient)(), {
                            depreciationRunId: depreciationRunId,
                            depreciationRunReadableId: run.data.depreciationRunId,
                            postingDate: postingDate,
                            accountingPeriodId: accountingPeriod.data,
                            lines: lines,
                            locationDimensionId: locationDimensionId,
                            assetClassDimensionId: assetClassDimensionId,
                            taxEnabled: taxEnabled,
                            taxRate: taxRate,
                            dtlAccountId: dtlAccountId,
                            dtExpenseAccountId: dtExpenseAccountId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 19:
                    _6.sent();
                    return [3 /*break*/, 22];
                case 20:
                    err_1 = _6.sent();
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to post depreciation run"))];
                case 21: throw _s.apply(void 0, _t.concat([_6.sent()]));
                case 22:
                    _u = react_router_1.redirect;
                    _v = [path_1.path.to.depreciationRun(depreciationRunId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Depreciation run posted"))];
                case 23: throw _u.apply(void 0, _v.concat([_6.sent()]));
            }
        });
    });
}
