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
exports.loader = loader;
exports.action = action;
exports.default = DisposeFixedAssetRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var accounting_1 = require("~/modules/accounting");
var accounting_server_1 = require("~/modules/accounting/accounting.server");
var FixedAssets_1 = require("~/modules/accounting/ui/FixedAssets");
var database_server_1 = require("~/services/database.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, fixedAssetId, asset, _c, _d, _e, _f, nbv;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    fixedAssetId = params.fixedAssetId;
                    if (!fixedAssetId)
                        throw (0, auth_1.notFound)("fixedAssetId not found");
                    return [4 /*yield*/, (0, accounting_1.getFixedAsset)(client, fixedAssetId)];
                case 2:
                    asset = _g.sent();
                    if (!asset.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.fixedAssets];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(asset.error, "Failed to get fixed asset"))];
                case 3: throw _c.apply(void 0, _d.concat([_g.sent()]));
                case 4:
                    if (!(asset.data.status !== "Active" &&
                        asset.data.status !== "Fully Depreciated")) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Only Active or Fully Depreciated assets can be disposed"))];
                case 5: throw _e.apply(void 0, _f.concat([_g.sent()]));
                case 6:
                    nbv = Number(asset.data.acquisitionCost) -
                        Number(asset.data.accumulatedDepreciation);
                    return [2 /*return*/, { asset: asset.data, currentNBV: nbv }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, fixedAssetId, formData, validation, disposalDate, disposalMethod, _d, asset, dimensionsResult, _e, _f, assetClass, acquisitionCost, accumulatedDepreciation, accountingPeriod, _g, _h, locationDimensionId, assetClassDimensionId, err_1, _j, _k, _l, _m;
        var _o, _p, _q, _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "accounting"
                        })];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    fixedAssetId = params.fixedAssetId;
                    if (!fixedAssetId)
                        throw (0, auth_1.notFound)("fixedAssetId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _s.sent();
                    return [4 /*yield*/, (0, form_1.validator)(accounting_1.fixedAssetDisposalValidator).validate(formData)];
                case 3:
                    validation = _s.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    disposalDate = validation.data.disposalDate;
                    disposalMethod = "Scrapping";
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("fixedAsset")
                                .select("*, fixedAssetClass:fixedAssetClassId(*)")
                                .eq("id", fixedAssetId)
                                .single(),
                            client
                                .from("dimension")
                                .select("id, entityType")
                                .eq("companyGroupId", companyGroupId)
                                .eq("active", true)
                        ])];
                case 4:
                    _d = _s.sent(), asset = _d[0], dimensionsResult = _d[1];
                    if (!asset.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(asset.error, "Failed to get asset"))];
                case 5: throw _e.apply(void 0, _f.concat([_s.sent()]));
                case 6:
                    assetClass = asset.data.fixedAssetClass;
                    acquisitionCost = Number(asset.data.acquisitionCost);
                    accumulatedDepreciation = Number(asset.data.accumulatedDepreciation);
                    return [4 /*yield*/, (0, accounting_1.getOrCreateAccountingPeriod)(client, companyId, disposalDate)];
                case 7:
                    accountingPeriod = _s.sent();
                    if (!accountingPeriod.error) return [3 /*break*/, 9];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(accountingPeriod.error, "Failed to get accounting period"))];
                case 8: throw _g.apply(void 0, _h.concat([_s.sent()]));
                case 9:
                    locationDimensionId = (_p = ((_o = dimensionsResult.data) !== null && _o !== void 0 ? _o : []).find(function (d) { return d.entityType === "Location"; })) === null || _p === void 0 ? void 0 : _p.id;
                    assetClassDimensionId = (_r = ((_q = dimensionsResult.data) !== null && _q !== void 0 ? _q : []).find(function (d) { return d.entityType === "FixedAssetClass"; })) === null || _r === void 0 ? void 0 : _r.id;
                    _s.label = 10;
                case 10:
                    _s.trys.push([10, 12, , 14]);
                    return [4 /*yield*/, (0, accounting_server_1.postDisposal)((0, database_server_1.getDatabaseClient)(), {
                            fixedAssetId: fixedAssetId,
                            fixedAssetReadableId: asset.data.fixedAssetId,
                            disposalDate: disposalDate,
                            disposalMethod: disposalMethod,
                            acquisitionCost: acquisitionCost,
                            accumulatedDepreciation: accumulatedDepreciation,
                            locationId: asset.data.locationId,
                            fixedAssetClassId: asset.data.fixedAssetClassId,
                            assetAccountId: assetClass.assetAccountId,
                            accumulatedDepreciationAccountId: assetClass.accumulatedDepreciationAccountId,
                            writeOffAccountId: assetClass.writeOffAccountId,
                            accountingPeriodId: accountingPeriod.data,
                            locationDimensionId: locationDimensionId,
                            assetClassDimensionId: assetClassDimensionId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 11:
                    _s.sent();
                    return [3 /*break*/, 14];
                case 12:
                    err_1 = _s.sent();
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to post asset disposal"))];
                case 13: throw _j.apply(void 0, _k.concat([_s.sent()]));
                case 14:
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Asset disposed successfully"))];
                case 15: throw _l.apply(void 0, _m.concat([_s.sent()]));
            }
        });
    });
}
function DisposeFixedAssetRoute() {
    var currentNBV = (0, react_router_1.useLoaderData)().currentNBV;
    var navigate = (0, react_router_1.useNavigate)();
    return (<FixedAssets_1.FixedAssetDisposalForm currentNBV={currentNBV} onClose={function () { return navigate(-1); }}/>);
}
